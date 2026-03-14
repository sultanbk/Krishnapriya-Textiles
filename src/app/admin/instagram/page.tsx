"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink, GripVertical, Eye, EyeOff, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

interface InstagramVideo {
  id: string;
  url: string;
  title: string;
  isActive: boolean;
  position: number;
  createdAt: string;
}

export default function AdminInstagramPage() {
  const [videos, setVideos] = useState<InstagramVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  async function fetchVideos() {
    try {
      const res = await fetch("/api/admin/instagram");
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch {
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  async function handleAdd() {
    if (!newUrl.trim()) {
      toast.error("Please enter an Instagram URL");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl, title: newTitle }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add video");
      }

      toast.success("Instagram video added!");
      setNewUrl("");
      setNewTitle("");
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/instagram/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Video removed");
      setVideos((v) => v.filter((item) => item.id !== id));
    } catch {
      toast.error("Failed to delete video");
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/admin/instagram/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setVideos((v) =>
        v.map((item) =>
          item.id === id ? { ...item, isActive: !isActive } : item
        )
      );
      toast.success(isActive ? "Video hidden" : "Video visible");
    } catch {
      toast.error("Failed to update video");
    }
  }

  /**
   * Extract a clean Instagram embed URL from various link formats:
   * - https://www.instagram.com/reel/ABC123/
   * - https://www.instagram.com/p/ABC123/
   * - https://www.instagram.com/reel/ABC123/?igsh=...
   */
  function getEmbedUrl(url: string) {
    try {
      const u = new URL(url);
      // Remove query params and ensure trailing slash
      const path = u.pathname.replace(/\/$/, "");
      return `https://www.instagram.com${path}/embed/`;
    } catch {
      return url;
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Instagram Videos</h1>
        <p className="text-sm text-muted-foreground">
          Add Instagram reel/post links to display on the homepage. Just paste the URL!
        </p>
      </div>

      {/* Add New Video */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Instagram className="h-5 w-5" />
            Add New Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Paste Instagram URL (reel or post)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Input
              placeholder="Title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:w-48"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={adding}>
              <Plus className="mr-2 h-4 w-4" />
              {adding ? "Adding..." : "Add Video"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Supported formats: https://www.instagram.com/reel/... or https://www.instagram.com/p/...
          </p>
        </CardContent>
      </Card>

      {/* Videos List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : videos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Instagram className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 font-medium">No Instagram videos added yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first video using the form above
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video, i) => (
                <TableRow key={video.id}>
                  <TableCell className="font-mono text-sm">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {video.url.length > 50
                        ? video.url.substring(0, 50) + "..."
                        : video.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {video.title || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={video.isActive ? "default" : "secondary"}>
                      {video.isActive ? "Visible" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggle(video.id, video.isActive)}
                        title={video.isActive ? "Hide" : "Show"}
                      >
                        {video.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <ConfirmDialog
                        title="Delete this video?"
                        description="This Instagram video will be permanently removed from your website."
                        confirmText="Yes, Delete"
                        variant="destructive"
                        onConfirm={() => handleDelete(video.id)}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ConfirmDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
