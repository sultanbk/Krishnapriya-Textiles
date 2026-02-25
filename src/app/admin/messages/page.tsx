import { Metadata } from "next";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { Mail, MailOpen, Phone, MessageSquareText, User, Tag, Trash2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "./message-actions";

export const metadata: Metadata = {
  title: "Customer Messages | Admin",
};

export default async function MessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">📩 Customer Messages</h1>
          <p className="text-sm text-muted-foreground">
            Messages from the &quot;Contact Us&quot; page on your website
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="w-fit text-sm px-3 py-1">
            {unreadCount} new {unreadCount === 1 ? "message" : "messages"}
          </Badge>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center">
          <MessageSquareText className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-semibold">No messages yet</p>
          <p className="text-sm text-muted-foreground">
            When customers send a message from your website, it will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border bg-card p-5 shadow-sm transition-all ${
                !msg.isRead
                  ? "ring-2 ring-primary/20 border-primary/30"
                  : "ring-1 ring-border/50"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    !msg.isRead ? "bg-primary/10" : "bg-muted"
                  }`}>
                    {!msg.isRead ? (
                      <Mail className="h-4 w-4 text-primary" />
                    ) : (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{msg.name}</h3>
                      {!msg.isRead && (
                        <Badge className="bg-primary/10 text-primary text-[10px] hover:bg-primary/10">
                          New
                        </Badge>
                      )}
                      {msg.subject && (
                        <Badge variant="outline" className="text-[10px]">
                          <Tag className="mr-1 h-2.5 w-2.5" />
                          {msg.subject}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${msg.phone}`} className="hover:text-primary hover:underline">
                          {msg.phone}
                        </a>
                      </span>
                      {msg.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <a href={`mailto:${msg.email}`} className="hover:text-primary hover:underline">
                            {msg.email}
                          </a>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(msg.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <MessageActions id={msg.id} isRead={msg.isRead} />
              </div>
              <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
