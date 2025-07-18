import React, { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { PodDetail } from "./components/PodDetail";
import { CreatePod } from "./components/CreatePod";
import { UserProfile } from "./components/UserProfile";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Toaster } from "./components/ui/sonner";
import {
  Users,
  Clock,
  Settings,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Bridge from "./imports/Bridge";

// Define workflow stages
const WORKFLOW_STAGES = [
  "Product",
  "Design",
  "Frontend",
  "Backend", 
  "QA",
  "Go live",
];

// Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // member ID
  assignedBy: string; // who created the task
  createdAt: string;
  status: 'pending' | 'in-progress' | 'completed';
  link?: string;
  completedAt?: string;
}

// Mock user data
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@company.com",
  role: "admin" as "admin" | "employee",
};

// Mock PODs data with new structure including tasks and tags
const mockPods = [
  {
    id: "1",
    name: "Mobile App Redesign",
    description: "Complete redesign of our mobile application with new user interface and improved user experience",
    owner: "John Doe",
    tag: "Feature" as "Feature" | "Go-Live",
    createdAt: "2025-01-10T09:00:00Z",
    startDate: "2025-01-10T09:00:00Z",
    endDate: "2025-01-24T17:00:00Z",
    currentStage: 2, // Currently at Frontend stage (0-indexed)
    members: [
      { 
        id: "1", 
        name: "Dhruv", 
        role: "Product", 
        taskDescription: "Create comprehensive PRD and user stories for the mobile app redesign",
        startDate: "2025-01-10T09:00:00Z",
        endDate: "2025-01-12T17:00:00Z",
        handoffLink: "https://notion.so/prd-mobile-redesign", 
        completed: true,
        workStartedAt: "2025-01-10T09:00:00Z",
        workCompletedAt: "2025-01-12T17:00:00Z",
        actualTimeSpent: 2
      },
      { 
        id: "2", 
        name: "Ayush", 
        role: "Design", 
        taskDescription: "Design new UI/UX mockups and create interactive prototypes",
        startDate: "2025-01-12T17:00:00Z",
        endDate: "2025-01-15T16:00:00Z",
        handoffLink: "https://figma.com/mobile-app-designs", 
        completed: true,
        workStartedAt: "2025-01-12T17:00:00Z",
        workCompletedAt: "2025-01-15T16:00:00Z",
        actualTimeSpent: 3
      },
      { 
        id: "3", 
        name: "Mona", 
        role: "Frontend", 
        taskDescription: "Implement frontend components and integrate with backend APIs",
        startDate: "2025-01-15T16:00:00Z",
        endDate: "2025-01-22T17:00:00Z",
        handoffLink: "", 
        completed: false,
        workStartedAt: "2025-01-15T16:00:00Z",
        workCompletedAt: null,
        actualTimeSpent: 0
      },
      { 
        id: "4", 
        name: "Hansal", 
        role: "Backend", 
        taskDescription: "Backend API development and database optimization",
        startDate: "2025-01-15T16:00:00Z",
        endDate: "2025-01-22T17:00:00Z",
        handoffLink: "", 
        completed: false,
        workStartedAt: null,
        workCompletedAt: null,
        actualTimeSpent: 0
      },
      { 
        id: "5", 
        name: "Ammaar", 
        role: "QA", 
        taskDescription: "Comprehensive testing including functional, performance, and usability testing",
        startDate: "2025-01-22T17:00:00Z",
        endDate: "2025-01-24T17:00:00Z",
        handoffLink: "", 
        completed: false,
        workStartedAt: null,
        workCompletedAt: null,
        actualTimeSpent: 0
      }
    ],
    tasks: [
      {
        id: "task-1",
        title: "User Research Analysis",
        description: "Analyze current user research data and identify key pain points",
        assignedTo: "1", // Dhruv
        assignedBy: "1", // John Doe
        createdAt: "2025-01-10T10:00:00Z",
        status: "completed" as const,
        link: "https://docs.google.com/document/user-research-analysis",
        completedAt: "2025-01-11T15:00:00Z"
      },
      {
        id: "task-2",
        title: "Design System Documentation",
        description: "Create comprehensive design system documentation for the new UI components",
        assignedTo: "2", // Ayush
        assignedBy: "1", // John Doe
        createdAt: "2025-01-12T09:00:00Z",
        status: "completed" as const,
        link: "https://www.figma.com/design-system-docs",
        completedAt: "2025-01-14T12:00:00Z"
      },
      {
        id: "task-3",
        title: "API Documentation",
        description: "Document all new API endpoints and their usage",
        assignedTo: "4", // Hansal
        assignedBy: "1", // John Doe
        createdAt: "2025-01-16T11:00:00Z",
        status: "in-progress" as const
      }
    ],
    status: "in-progress" as "planning" | "in-progress" | "completed",
    workflowOrder: ["Product", "Design", "Frontend", "Backend", "QA"]
  },
  {
    id: "2",
    name: "Payment Gateway Integration",
    description: "Integration of new payment gateway to support multiple payment methods and improve transaction success rate",
    owner: "Sarah Johnson",
    tag: "Go-Live" as "Feature" | "Go-Live",
    createdAt: "2025-01-15T10:30:00Z",
    startDate: "2025-01-15T10:30:00Z",
    endDate: "2025-01-25T17:00:00Z",
    currentStage: 1, // Currently at Backend stage
    members: [
      { 
        id: "6", 
        name: "Sarah", 
        role: "Product", 
        taskDescription: "Define payment flow requirements and create technical specifications",
        startDate: "2025-01-15T10:30:00Z",
        endDate: "2025-01-17T14:30:00Z",
        handoffLink: "https://notion.so/payment-prd", 
        completed: true,
        workStartedAt: "2025-01-15T10:30:00Z",
        workCompletedAt: "2025-01-17T14:30:00Z",
        actualTimeSpent: 2
      },
      { 
        id: "7", 
        name: "Alex", 
        role: "Backend", 
        taskDescription: "Implement payment gateway APIs and handle transaction processing",
        startDate: "2025-01-17T14:30:00Z",
        endDate: "2025-01-23T17:00:00Z",
        handoffLink: "", 
        completed: false,
        workStartedAt: "2025-01-17T14:30:00Z",
        workCompletedAt: null,
        actualTimeSpent: 0
      },
      { 
        id: "8", 
        name: "Maya", 
        role: "QA", 
        taskDescription: "Test payment flows and ensure security compliance",
        startDate: "2025-01-23T17:00:00Z",
        endDate: "2025-01-25T17:00:00Z",
        handoffLink: "", 
        completed: false,
        workStartedAt: null,
        workCompletedAt: null,
        actualTimeSpent: 0
      }
    ],
    tasks: [
      {
        id: "task-4",
        title: "Payment Gateway Research",
        description: "Research and compare different payment gateway options",
        assignedTo: "6", // Sarah
        assignedBy: "6", // Sarah Johnson
        createdAt: "2025-01-15T11:00:00Z",
        status: "completed" as const,
        link: "https://docs.google.com/spreadsheet/payment-gateway-comparison",
        completedAt: "2025-01-16T16:00:00Z"
      }
    ],
    status: "in-progress",
    workflowOrder: ["Product", "Backend", "QA"]
  }
];

// Mock Slack notification function
const sendSlackNotification = (
  memberName: string,
  podName: string,
  handoffLink: string,
) => {
  console.log(`🔔 Slack Notification Sent:`);
  console.log(`To: ${memberName}`);
  console.log(
    `Message: You have been handed off work for "${podName}". Please check: ${handoffLink}`,
  );
  console.log(`Timer started for ${memberName}'s work phase.`);
};

export default function App() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "pod-detail" | "create-pod" | "profile"
  >("dashboard");
  const [selectedPodId, setSelectedPodId] = useState<
    string | null
  >(null);
  const [user, setUser] = useState(mockUser);
  const [pods, setPods] = useState(mockPods);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Timer management
  useEffect(() => {
    const interval = setInterval(() => {
      setPods((currentPods) =>
        currentPods.map((pod) => {
          const currentMember = pod.members.find(
            (member, index) =>
              index === pod.currentStage && !member.completed,
          );

          if (currentMember && currentMember.workStartedAt) {
            const now = new Date();
            const startTime = new Date(
              currentMember.workStartedAt,
            );
            const hoursWorked =
              (now.getTime() - startTime.getTime()) /
              (1000 * 60 * 60);
            const daysWorked =
              Math.round((hoursWorked / 24) * 10) / 10; // Round to 1 decimal

            return {
              ...pod,
              members: pod.members.map((member) =>
                member.id === currentMember.id
                  ? { ...member, actualTimeSpent: daysWorked }
                  : member,
              ),
            };
          }
          return pod;
        }),
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return (
      <LoginScreen onLogin={() => setIsAuthenticated(true)} />
    );
  }

  const handleViewPod = (podId: string) => {
    setSelectedPodId(podId);
    setCurrentView("pod-detail");
  };

  const handleCreatePod = (podData: any) => {
    // Organize members by workflow order, allowing multiple members per role
    const orderedMembers: any[] = [];
    
    podData.workflowOrder.forEach((stage: string) => {
      const stageMembers = podData.members.filter((m: any) => m.role === stage);
      stageMembers.forEach((member: any, index: number) => {
        orderedMembers.push({
          ...member,
          workStartedAt: stage === podData.workflowOrder[0] && index === 0 ? new Date().toISOString() : null,
          workCompletedAt: null,
          actualTimeSpent: 0
        });
      });
    });

    const newPod = {
      id: Date.now().toString(),
      name: podData.name,
      description: podData.description,
      owner: podData.owner,
      tag: podData.tag,
      startDate: podData.startDate,
      endDate: podData.endDate,
      createdAt: new Date().toISOString(),
      status: "in-progress" as const,
      currentStage: 0,
      members: orderedMembers,
      tasks: [], // Initialize with empty tasks array
      workflowOrder: podData.workflowOrder,
    };

    setPods([...pods, newPod]);
    setCurrentView("dashboard");
  };

  const handleDeletePod = (podId: string) => {
    const podToDelete = pods.find(p => p.id === podId);
    
    setPods(pods.filter(pod => pod.id !== podId));
    
    // Show success toast
    toast.success('POD deleted successfully', {
      description: `"${podToDelete?.name}" has been removed from the system.`,
      duration: 5000,
    });

    // If the deleted POD was currently being viewed, go back to dashboard
    if (selectedPodId === podId) {
      setCurrentView("dashboard");
      setSelectedPodId(null);
    }
  };

  const handleUpdatePod = (updatedPod: any) => {
    setPods(
      pods.map((pod) => {
        if (pod.id === updatedPod.id) {
          // Check if handoff occurred
          const originalPod = pods.find((p) => p.id === pod.id);
          const currentMember =
            originalPod?.members[originalPod.currentStage];
          const updatedCurrentMember =
            updatedPod.members[updatedPod.currentStage];

          // If handoff link was just added
          if (
            currentMember &&
            updatedCurrentMember &&
            !currentMember.handoffLink &&
            updatedCurrentMember.handoffLink
          ) {
            // Mark current member as completed
            const now = new Date().toISOString();
            updatedCurrentMember.completed = true;
            updatedCurrentMember.workCompletedAt = now;

            // Move to next stage
            const nextStage = updatedPod.currentStage + 1;
            if (nextStage < updatedPod.members.length) {
              updatedPod.currentStage = nextStage;
              const nextMember = updatedPod.members[nextStage];
              nextMember.workStartedAt = now;

              // Send Slack notification
              sendSlackNotification(
                nextMember.name,
                updatedPod.name,
                updatedCurrentMember.handoffLink,
              );
            } else {
              // All stages completed
              updatedPod.status = "completed";
            }
          }

          return updatedPod;
        }
        return pod;
      }),
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            pods={pods}
            user={user}
            onViewPod={handleViewPod}
            onCreatePod={() => setCurrentView("create-pod")}
            onViewProfile={() => setCurrentView("profile")}
            onDeletePod={handleDeletePod}
          />
        );
      case "pod-detail":
        const selectedPod = pods.find(
          (pod) => pod.id === selectedPodId,
        );
        return selectedPod ? (
          <PodDetail
            pod={selectedPod}
            user={user}
            onBack={() => setCurrentView("dashboard")}
            onUpdate={handleUpdatePod}
          />
        ) : (
          <div>POD not found</div>
        );
      case "create-pod":
        return (
          <CreatePod
            user={user}
            onBack={() => setCurrentView("dashboard")}
            onCreatePod={handleCreatePod}
          />
        );
      case "profile":
        return (
          <UserProfile
            user={user}
            onBack={() => setCurrentView("dashboard")}
            onUpdateUser={setUser}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
      <Toaster />
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-8 h-8">
              <Bridge />
            </div>
            <h1 className="text-2xl font-bold">
              Bridge
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Project Handoff Tool
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button onClick={onLogin} className="w-full">
            Sign In
          </Button>
        </div>
      </Card>
    </div>
  );
}