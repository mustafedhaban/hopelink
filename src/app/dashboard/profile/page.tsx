"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState("overview");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
      setAvatar(session.user.image || null);
    }
  }, [session]);

  if (status === "loading") {
    return <Shell>
      <div className="p-8">Loading...</div>
    </Shell>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  // Profile update
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile");
      } else {
        setSuccess("Profile updated successfully!");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Avatar upload
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      // Convert file to base64
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      const base64 = await toBase64(avatarFile);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: base64 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update avatar");
      } else {
        setSuccess("Avatar updated successfully!");
        setAvatarFile(null);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Password change
  const handlePwChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };
  const handlePwSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError("");
    setPwSuccess("");
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("Passwords do not match");
      setPwLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: pwForm.oldPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Failed to change password");
      } else {
        setPwSuccess("Password changed successfully!");
        setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setPwError("An unexpected error occurred");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Shell>
      <PageHeader heading="Your Profile" text="Manage your account settings and preferences" />
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
              </TabsList>
              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      src={avatar || "/avatar-placeholder.png"}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <span className="text-xs">Edit</span>
                    </label>
                  </div>
                  <Button size="sm" onClick={handleAvatarUpload} disabled={!avatarFile}>
                    {avatarFile ? "Upload Avatar" : "Change Avatar"}
                  </Button>
                  <div className="text-center mt-2">
                    <div className="font-semibold text-lg">{formData.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">{formData.email}</div>
                    <div className="text-xs mt-1 text-blue-700 dark:text-blue-300">Role: {session.user.role || "User"}</div>
                  </div>
                </div>
              </TabsContent>
              {/* Edit Profile Tab */}
              <TabsContent value="edit">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-4">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </TabsContent>
              {/* Change Password Tab */}
              <TabsContent value="password">
                {pwError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{pwError}</AlertDescription>
                  </Alert>
                )}
                {pwSuccess && (
                  <Alert className="mb-4">
                    <AlertDescription>{pwSuccess}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handlePwSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <Input
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      value={pwForm.oldPassword}
                      onChange={handlePwChange}
                      required
                      disabled={pwLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={pwForm.newPassword}
                      onChange={handlePwChange}
                      required
                      disabled={pwLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={pwForm.confirmPassword}
                      onChange={handlePwChange}
                      required
                      disabled={pwLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={pwLoading}>
                    {pwLoading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}