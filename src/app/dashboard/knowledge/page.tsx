"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Check,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

function timeAgo(creationTime: number): string {
  const diffMs = Date.now() - creationTime;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function KnowledgePage() {
  const { getClaim } = useKindeBrowserClient();
  const orgCode = getClaim("org_code")?.value as string | undefined;

  const knowledge = useQuery(
    api.knowledge.getKnowledgeByOrg,
    orgCode ? { orgCode } : "skip"
  );
  const addEntry    = useMutation(api.knowledge.addKnowledgeEntry);
  const updateEntry = useMutation(api.knowledge.updateKnowledgeEntry);
  const deleteEntry = useMutation(api.knowledge.deleteKnowledgeEntry);

  // Add-form state
  const [showAdd, setShowAdd]         = useState(false);
  const [addTitle, setAddTitle]       = useState("");
  const [addContent, setAddContent]   = useState("");
  const [isSavingAdd, setIsSavingAdd] = useState(false);

  // Inline-edit state
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editTitle, setEditTitle]       = useState("");
  const [editContent, setEditContent]   = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete-confirm state
  const [confirmId, setConfirmId]   = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search state
  const [search, setSearch] = useState("");

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
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      setConfirmId(null);
      setDeletingId(id);
      deleteEntry({ id: id as Id<"knowledgeBase"> })
        .then(() => toast.success("Entry deleted"))
        .catch(() => toast.error("Failed to delete entry"))
        .finally(() => setDeletingId(null));
    } else {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      setConfirmId(id);
      confirmTimerRef.current = setTimeout(() => setConfirmId(null), 3000);
    }
  }

  const filtered = knowledge
    ? search.trim()
      ? knowledge.filter(
          (e) =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.content.toLowerCase().includes(search.toLowerCase())
        )
      : knowledge
    : [];

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-zinc-900">Knowledge Base</h1>
            {knowledge !== undefined && (
              <Badge variant="secondary" className="text-sm font-medium">
                {knowledge.length}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Entries your AI agent uses to draft responses and answer tickets for your Organization.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowAdd((v) => !v)}>
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Inline add form */}
      {showAdd && (
        <Card className="shadow-none">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-sm font-semibold text-zinc-700">New Entry</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-5">
            <form onSubmit={handleAddEntry} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="add-title" className="text-xs">
                  Title <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="add-content" className="text-xs">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="add-content"
                  placeholder="Entry content…"
                  value={addContent}
                  onChange={(e) => setAddContent(e.target.value)}
                  required
                  disabled={isSavingAdd}
                  className="min-h-[120px] resize-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" size="sm" className="gap-1.5" disabled={isSavingAdd}>
                  {isSavingAdd ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {isSavingAdd ? "Saving…" : "Save"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-zinc-500"
                  onClick={() => {
                    setShowAdd(false);
                    setAddTitle("");
                    setAddContent("");
                  }}
                  disabled={isSavingAdd}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      {knowledge !== undefined && knowledge.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <Input
            placeholder="Search entries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {knowledge === undefined && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-none">
              <CardContent className="px-6 py-5 flex flex-col gap-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty — no entries */}
      {knowledge !== undefined && knowledge.length === 0 && !showAdd && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <BookOpen className="h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-400">
            No knowledge base entries yet. Add your first entry above.
          </p>
        </div>
      )}

      {/* Empty — search has no matches */}
      {knowledge !== undefined && knowledge.length > 0 && filtered.length === 0 && search && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Search className="h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-400">No entries match your search.</p>
        </div>
      )}

      {/* Entry cards */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-4">
          {filtered.map((entry) => {
            const isEditing  = editingId === String(entry._id);
            const isDeleting = deletingId === String(entry._id);
            const isConfirm  = confirmId === String(entry._id);

            if (isEditing) {
              return (
                <Card key={String(entry._id)} className="shadow-none">
                  <CardContent className="px-6 py-5 flex flex-col gap-4">
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
                        className="min-h-[120px] resize-none text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => handleSaveEdit(entry._id as Id<"knowledgeBase">)}
                        disabled={isSavingEdit}
                      >
                        {isSavingEdit ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        {isSavingEdit ? "Saving…" : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-zinc-500"
                        onClick={() => setEditingId(null)}
                        disabled={isSavingEdit}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card key={String(entry._id)} className="shadow-none">
                <CardContent className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-zinc-900">{entry.title}</h3>
                      <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      <span className="text-xs text-zinc-400">{timeAgo(entry._creationTime)}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-zinc-400 hover:text-zinc-700"
                        onClick={() => startEdit(String(entry._id), entry.title, entry.content)}
                        disabled={isDeleting}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {isConfirm && !isDeleting && (
                        <span className="text-xs text-red-600 font-medium">Confirm?</span>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 ${isConfirm ? "text-red-600 hover:text-red-700" : "text-zinc-400 hover:text-red-600"}`}
                        onClick={() => handleDeleteClick(String(entry._id))}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
