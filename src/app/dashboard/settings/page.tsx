"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Building2,
  Check,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const { user, getOrganization } = useKindeBrowserClient();
  const org = getOrganization();
  const orgCode = org?.orgCode ?? undefined;

  // KB data
  const knowledge = useQuery(
    api.knowledge.getKnowledgeByOrg,
    orgCode ? { orgCode } : "skip"
  );
  const addEntry    = useMutation(api.knowledge.addKnowledgeEntry);
  const updateEntry = useMutation(api.knowledge.updateKnowledgeEntry);
  const deleteEntry = useMutation(api.knowledge.deleteKnowledgeEntry);

  // Add-form state
  const [showAdd, setShowAdd]     = useState(false);
  const [addTitle, setAddTitle]   = useState("");
  const [addContent, setAddContent] = useState("");
  const [isSavingAdd, setIsSavingAdd] = useState(false);

  // Inline-edit state (one entry at a time)
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editTitle, setEditTitle]   = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete-confirm state
  const [confirmId, setConfirmId]   = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!orgCode) return;
    setIsSavingAdd(true);
    try {
      await addEntry({ orgCode, title: addTitle, content: addContent });
      toast.success("Entry added");
      setAddTitle("");
      setAddContent("");
      setShowAdd(false);
    } catch {
      toast.error("Failed to add entry");
    } finally {
      setIsSavingAdd(false);
    }
  }

  function startEdit(id: string, title: string, content: string) {
    setEditingId(id);
    setEditTitle(title);
    setEditContent(content);
  }

  async function handleSaveEdit(id: Id<"knowledgeBase">) {
    setIsSavingEdit(true);
    try {
      await updateEntry({ id, title: editTitle, content: editContent });
      toast.success("Entry updated");
      setEditingId(null);
    } catch {
      toast.error("Failed to update entry");
    } finally {
      setIsSavingEdit(false);
    }
  }

  function handleDeleteClick(id: string) {
    if (confirmId === id) {
      // Second click — confirmed
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      setConfirmId(null);
      setDeletingId(id);
      deleteEntry({ id: id as Id<"knowledgeBase"> })
        .then(() => toast.success("Entry deleted"))
        .catch(() => toast.error("Failed to delete entry"))
        .finally(() => setDeletingId(null));
    } else {
      // First click — arm confirm
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      setConfirmId(id);
      confirmTimerRef.current = setTimeout(() => setConfirmId(null), 3000);
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your organization and knowledge base.
        </p>
      </div>

      {/* Organisation card */}
      <Card className="shadow-none">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
            <Building2 className="h-4 w-4 text-zinc-400" />
            Organization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Org Name</span>
              <span className="text-sm font-medium text-zinc-800">
                {org?.orgName ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Org Code</span>
              <span className="font-mono text-sm text-zinc-600">
                {org?.orgCode ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Account Owner</span>
              <span className="text-sm text-zinc-800">
                {user?.given_name && user?.family_name
                  ? `${user.given_name} ${user.family_name}`
                  : user?.email ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Plan</span>
              <div>
                <Badge className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs">Pro</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge base */}
      <Card className="shadow-none">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
              <BookOpen className="h-4 w-4 text-zinc-400" />
              Knowledge Base
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-8 text-xs"
              onClick={() => setShowAdd((v) => !v)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Entry
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-0">
          {/* Loading */}
          {knowledge === undefined && (
            <div className="divide-y divide-zinc-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-4 flex flex-col gap-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {knowledge !== undefined && knowledge.length === 0 && !showAdd && (
            <div className="py-16 flex flex-col items-center gap-2">
              <BookOpen className="h-8 w-8 text-zinc-300" />
              <p className="text-sm text-zinc-400">No knowledge base entries yet.</p>
            </div>
          )}

          {/* Entry list */}
          {knowledge !== undefined && knowledge.length > 0 && (
            <div className="divide-y divide-zinc-100">
              {knowledge.map((entry) => {
                const isEditing  = editingId === String(entry._id);
                const isDeleting = deletingId === String(entry._id);
                const isConfirm  = confirmId === String(entry._id);

                if (isEditing) {
                  return (
                    <div key={String(entry._id)} className="py-4 flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          disabled={isSavingEdit}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs">Content</Label>
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          disabled={isSavingEdit}
                          className="min-h-[100px] resize-none text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="gap-1.5 h-7 text-xs"
                          onClick={() => handleSaveEdit(entry._id as Id<"knowledgeBase">)}
                          disabled={isSavingEdit}
                        >
                          {isSavingEdit ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5 h-7 text-xs text-zinc-500"
                          onClick={() => setEditingId(null)}
                          disabled={isSavingEdit}
                        >
                          <X className="h-3 w-3" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={String(entry._id)} className="flex items-start justify-between py-4 gap-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-medium text-zinc-800 truncate">
                        {entry.title}
                      </span>
                      <span className="text-xs text-zinc-400 line-clamp-1">
                        {entry.content}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-zinc-400 hover:text-zinc-700"
                        onClick={() => startEdit(String(entry._id), entry.title, entry.content)}
                        disabled={isDeleting}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {isConfirm && !isDeleting && (
                        <span className="text-xs text-red-600 font-medium mr-1">Confirm?</span>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-7 w-7 ${isConfirm ? "text-red-600 hover:text-red-700" : "text-zinc-400 hover:text-red-600"}`}
                        onClick={() => handleDeleteClick(String(entry._id))}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Inline add form */}
          {showAdd && (
            <form
              onSubmit={handleAddEntry}
              className="border-t border-zinc-100 pt-4 pb-5 flex flex-col gap-4"
            >
              <p className="text-sm font-medium text-zinc-700">New entry</p>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="add-title" className="text-xs">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="add-title"
                  placeholder="Entry title"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  required
                  disabled={isSavingAdd}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="add-content" className="text-xs">Content <span className="text-red-500">*</span></Label>
                <Textarea
                  id="add-content"
                  placeholder="Entry content…"
                  value={addContent}
                  onChange={(e) => setAddContent(e.target.value)}
                  required
                  disabled={isSavingAdd}
                  className="min-h-[100px] resize-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" size="sm" className="gap-1.5" disabled={isSavingAdd}>
                  {isSavingAdd ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  {isSavingAdd ? "Saving…" : "Save"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-zinc-500"
                  onClick={() => { setShowAdd(false); setAddTitle(""); setAddContent(""); }}
                  disabled={isSavingAdd}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Sign out */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900">Sign out</p>
          <p className="text-xs text-zinc-500">You will be redirected to the login page.</p>
        </div>
        <LogoutLink>
          <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </LogoutLink>
      </div>
    </div>
  );
}
