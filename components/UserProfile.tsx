import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Bell,
  Palette,
  Save,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
}

interface UserProfileProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

export function UserProfile({
  user,
  onBack,
  onUpdateUser,
}: UserProfileProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    taskReminders: true,
    darkMode: false,
  });

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: formData.name,
      email: formData.email,
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });
    setEditMode(false);
  };

  const handlePreferenceChange = (
    key: string,
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-3 flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl text-gray-900">
                User Profile
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg text-gray-900 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </h2>
              {!editMode && (
                <Button
                  variant="outline"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-blue-700">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg text-gray-900">
                  {user.name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <Badge className="mt-1">
                  {user.role === "admin"
                    ? "Administrator"
                    : "Employee"}
                </Badge>
              </div>
            </div>

            {editMode ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">
                    Full Name
                  </Label>
                  <p className="text-gray-900 mt-1">
                    {user.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    Email Address
                  </Label>
                  <p className="text-gray-900 mt-1">
                    {user.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    Role
                  </Label>
                  <p className="text-gray-900 mt-1">
                    {user.role === "admin"
                      ? "Administrator"
                      : "Employee"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    Member Since
                  </Label>
                  <p className="text-gray-900 mt-1">
                    January 2025
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Notification Preferences */}
          <Card className="p-4">
            <h2 className="text-lg text-gray-900 flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5" />
              <span>Notification Preferences</span>
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange(
                      "emailNotifications",
                      checked,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange(
                      "pushNotifications",
                      checked,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-gray-600">
                    Get a weekly summary of POD activities
                  </p>
                </div>
                <Switch
                  checked={preferences.weeklyDigest}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange(
                      "weeklyDigest",
                      checked,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Task Reminders</Label>
                  <p className="text-sm text-gray-600">
                    Remind me about pending tasks
                  </p>
                </div>
                <Switch
                  checked={preferences.taskReminders}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange(
                      "taskReminders",
                      checked,
                    )
                  }
                />
              </div>
            </div>
          </Card>

          {/* Appearance Settings */}
          <Card className="p-4">
            <h2 className="text-lg text-gray-900 flex items-center space-x-2 mb-4">
              <Palette className="h-5 w-5" />
              <span>Appearance</span>
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-600">
                    Use dark theme for the interface
                  </p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange("darkMode", checked)
                  }
                />
              </div>
            </div>
          </Card>

          {/* Account Security */}
          <Card className="p-4">
            <h2 className="text-lg text-gray-900 flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5" />
              <span>Account Security</span>
            </h2>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-gray-600">
                  Password
                </Label>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-900">••••••••</p>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  Two-Factor Authentication
                </Label>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-600">Not enabled</p>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Admin Panel Access */}
          {user.role === "admin" && (
            <Card className="p-4">
              <h2 className="text-lg text-gray-900 mb-4">
                Administrator Tools
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>User Management</Label>
                    <p className="text-sm text-gray-600">
                      Manage company users and permissions
                    </p>
                  </div>
                  <Button variant="outline">
                    Manage Users
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>System Settings</Label>
                    <p className="text-sm text-gray-600">
                      Configure system-wide settings
                    </p>
                  </div>
                  <Button variant="outline">
                    System Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}