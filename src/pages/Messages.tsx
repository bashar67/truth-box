import { useEffect, useState, useCallback } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import axiosInstance from "@/lib/axios";
import { Copy, Trash2, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  isAnonymous: boolean;
}

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareableUrl, setShareableUrl] = useState("");

  const fetchMessages = useCallback(async () => {
    // try {
    //   setLoading(true);

    //   const response = await axiosInstance.get("/message/get-messages");

    //   setMessages(response.data.data?.messages || []);
    //   setShareableUrl(
    //     response.data.data?.shareableUrl || `${window.location.origin}`
    //   );
    // } catch (error) {
    //   toast.error(error.response?.data?.message || "Failed to load messages");
    // } finally {
    //   setLoading(false);
    // }

    setLoading(true);
    const messages = localStorage.getItem("messages");

    setMessages(messages ? JSON.parse(messages) : []);
    setShareableUrl(user?.sharedUrl || `${window.location.origin}`);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await axiosInstance.delete(`/message/delete-messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      toast.success("Message deleted successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast.success("URL copied to clipboard!");
  };

  return (
    <>
      <Helmet>
        <title>My Messages - TruthBox</title>
        <meta name="description" content="View your anonymous messages" />
      </Helmet>

      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              My Messages
            </h1>

            <div className="bg-gradient-hero border border-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-3">
                Share your TruthBox link to receive anonymous messages:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareableUrl}
                  readOnly
                  className="flex-1 px-4 py-2.5 rounded-lg border bg-background text-foreground border-input"
                />
                <Button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No messages yet
              </h3>
              <p className="text-muted-foreground">
                Share your link to start receiving anonymous messages!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-foreground mb-2">{message.content}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(message.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(message._id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default Messages;
