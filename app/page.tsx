"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  FileText,
  Folder,
  FolderOpen,
  MessageSquare,
  Terminal,
  Play,
  Save,
  Search,
  Plus,
  Trash2,
  Edit3,
  Copy,
  FileCode,
  FileImage,
  FileJson,
  Cast as Css3,
  Database,
  Code,
  Bug,
  Lightbulb,
  Wand2,
  Send,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  X,
  Minimize2,
  Maximize2,
  Settings,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Users,
  Activity,
  History,
  Package,
  Zap,
  Palette,
  FolderIcon,
  Star,
  BarChart3,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Keyboard,
} from "lucide-react"

// File type icons mapping
const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "tsx":
    case "ts":
    case "js":
    case "jsx":
      return <FileCode className="w-4 h-4 text-blue-400" />
    case "css":
    case "scss":
    case "sass":
      return <Css3 className="w-4 h-4 text-pink-400" />
    case "json":
      return <FileJson className="w-4 h-4 text-yellow-400" />
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <FileImage className="w-4 h-4 text-green-400" />
    case "sql":
      return <Database className="w-4 h-4 text-orange-400" />
    case "md":
      return <FileText className="w-4 h-4 text-gray-400" />
    default:
      return <FileText className="w-4 h-4 text-muted-foreground" />
  }
}

// File/Folder interface
interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileItem[]
  path: string
}

function CodeEditor({
  value,
  onChange,
  language = "typescript",
  fileName = "untitled",
}: {
  value: string
  onChange: (value: string) => void
  language?: string
  fileName?: string
}) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSaved) {
        setIsLoading(true)
        setTimeout(() => {
          setIsLoading(false)
          setIsSaved(true)
        }, 800)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [value, isSaved])

  const handleChange = (newValue: string) => {
    onChange(newValue)
    setIsSaved(false)
  }

  return (
    <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <div className="transition-transform duration-200 hover:scale-110">{getFileIcon(fileName)}</div>
          <span className="text-sm font-mono">{fileName}</span>
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isLoading ? "bg-yellow-500 animate-pulse" : isSaved ? "bg-green-500" : "bg-primary animate-pulse"
            }`}
          />
          {isLoading && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 transition-all duration-200 hover:scale-105 hover:bg-primary/10"
            disabled={isLoading}
          >
            <Save className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 transition-all duration-200 hover:scale-105 hover:bg-green-500/10"
          >
            <Play className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <textarea
        ref={editorRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-full bg-transparent text-foreground font-mono text-sm p-4 resize-none outline-none transition-all duration-200 focus:bg-muted/20"
        style={{ minHeight: "500px" }}
        placeholder="// Start coding..."
        spellCheck={false}
      />
    </div>
  )
}

function FileExplorer({ onFileSelect }: { onFileSelect: (file: FileItem) => void }) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src", "components"]))
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "src",
      type: "folder",
      path: "/src",
      children: [
        {
          id: "2",
          name: "components",
          type: "folder",
          path: "/src/components",
          children: [
            { id: "3", name: "Button.tsx", type: "file", path: "/src/components/Button.tsx" },
            { id: "4", name: "Card.tsx", type: "file", path: "/src/components/Card.tsx" },
            { id: "5", name: "Modal.tsx", type: "file", path: "/src/components/Modal.tsx" },
          ],
        },
        {
          id: "6",
          name: "pages",
          type: "folder",
          path: "/src/pages",
          children: [
            { id: "7", name: "index.tsx", type: "file", path: "/src/pages/index.tsx" },
            { id: "8", name: "about.tsx", type: "file", path: "/src/pages/about.tsx" },
            { id: "9", name: "contact.tsx", type: "file", path: "/src/pages/contact.tsx" },
          ],
        },
        {
          id: "10",
          name: "styles",
          type: "folder",
          path: "/src/styles",
          children: [
            { id: "11", name: "globals.css", type: "file", path: "/src/styles/globals.css" },
            { id: "12", name: "components.scss", type: "file", path: "/src/styles/components.scss" },
          ],
        },
        { id: "13", name: "app.tsx", type: "file", path: "/src/app.tsx" },
        { id: "14", name: "main.tsx", type: "file", path: "/src/main.tsx" },
        { id: "15", name: "utils.ts", type: "file", path: "/src/utils.ts" },
      ],
    },
    {
      id: "16",
      name: "public",
      type: "folder",
      path: "/public",
      children: [
        { id: "17", name: "logo.svg", type: "file", path: "/public/logo.svg" },
        { id: "18", name: "favicon.ico", type: "file", path: "/public/favicon.ico" },
      ],
    },
    { id: "19", name: "package.json", type: "file", path: "/package.json" },
    { id: "20", name: "tsconfig.json", type: "file", path: "/tsconfig.json" },
    { id: "21", name: "README.md", type: "file", path: "/README.md" },
    { id: "22", name: ".gitignore", type: "file", path: "/.gitignore" },
  ])

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleFileClick = (file: FileItem) => {
    if (file.type === "file") {
      setIsLoading(true)
      setSelectedFile(file.id)
      setTimeout(() => {
        onFileSelect(file)
        setIsLoading(false)
      }, 300) // Simulate file loading
    } else {
      toggleFolder(file.id)
    }
  }

  const createNewFile = (parentPath: string) => {
    const fileName = prompt("Enter file name:")
    if (fileName) {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: fileName,
        type: "file",
        path: `${parentPath}/${fileName}`,
      }
      // In a real app, you'd update the file system here
      console.log("Creating file:", newFile)
    }
  }

  const createNewFolder = (parentPath: string) => {
    const folderName = prompt("Enter folder name:")
    if (folderName) {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: folderName,
        type: "folder",
        path: `${parentPath}/${folderName}`,
        children: [],
      }
      // In a real app, you'd update the file system here
      console.log("Creating folder:", newFolder)
    }
  }

  const deleteItem = (item: FileItem) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      // In a real app, you'd remove from file system here
      console.log("Deleting:", item)
    }
  }

  const renameItem = (item: FileItem) => {
    const newName = prompt("Enter new name:", item.name)
    if (newName && newName !== item.name) {
      // In a real app, you'd rename in file system here
      console.log("Renaming:", item.name, "to", newName)
    }
  }

  // Filter files based on search query
  const filterFiles = (items: FileItem[]): FileItem[] => {
    if (!searchQuery) return items

    return items
      .filter((item) => {
        if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true
        }
        if (item.children) {
          const filteredChildren = filterFiles(item.children)
          return filteredChildren.length > 0
        }
        return false
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterFiles(item.children) : undefined,
      }))
  }

  const renderFileTree = (items: FileItem[], level = 0) => {
    const filteredItems = filterFiles(items)

    return filteredItems.map((item) => (
      <div key={item.id} className="transition-all duration-200">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer text-sm rounded-sm transition-all duration-200 transform hover:scale-[1.02] hover:translate-x-1 ${
                selectedFile === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:shadow-sm"
              } ${level > 0 ? `ml-${level * 4}` : ""}`}
              onClick={() => handleFileClick(item)}
            >
              <div className="transition-transform duration-200 hover:scale-110">
                {item.type === "folder" ? (
                  <div
                    className={`transition-transform duration-300 ${expandedFolders.has(item.id) ? "rotate-90" : ""}`}
                  >
                    {expandedFolders.has(item.id) ? (
                      <FolderOpen className="w-4 h-4 text-primary" />
                    ) : (
                      <Folder className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ) : (
                  getFileIcon(item.name)
                )}
              </div>
              <span className="truncate">{item.name}</span>
              {isLoading && selectedFile === item.id && (
                <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin ml-auto" />
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="animate-in fade-in-0 zoom-in-95 duration-200">
            {item.type === "folder" && (
              <>
                <ContextMenuItem onClick={() => createNewFile(item.path)} className="transition-colors duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  New File
                </ContextMenuItem>
                <ContextMenuItem onClick={() => createNewFolder(item.path)} className="transition-colors duration-200">
                  <Folder className="w-4 h-4 mr-2" />
                  New Folder
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}
            <ContextMenuItem onClick={() => renameItem(item)} className="transition-colors duration-200">
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => navigator.clipboard.writeText(item.path)}
              className="transition-colors duration-200"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Path
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => deleteItem(item)}
              className="text-destructive transition-colors duration-200 hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        {item.type === "folder" && expandedFolders.has(item.id) && item.children && (
          <div className="ml-4 animate-in slide-in-from-left-2 duration-300">
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <Card className="w-64 h-full bg-sidebar border-sidebar-border flex flex-col transition-all duration-200 hover:shadow-md">
      <div className="p-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sidebar-foreground">Explorer</h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110 hover:bg-primary/10"
              onClick={() => createNewFile("/")}
            >
              <Plus className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110 hover:bg-primary/10"
              onClick={() => createNewFolder("/")}
            >
              <Folder className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors duration-200" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-7 text-xs bg-sidebar-accent border-sidebar-border transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">{renderFileTree(files)}</div>
      </ScrollArea>
    </Card>
  )
}

// Enhanced AI Chat Component with real AI integration
function AIChat({ currentFile, currentCode }: { currentFile: FileItem; currentCode: string }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant" as const,
      content:
        "Hello! I'm your AI coding assistant. I can help you with code generation, debugging, refactoring, and explanations. What would you like to work on?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatMode, setChatMode] = useState<"chat" | "code" | "debug" | "explain">("chat")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Simulate AI response with context awareness
  const getAIResponse = async (userMessage: string, mode: string): Promise<string> => {
    // In a real implementation, you would use the AI SDK here
    // const { text } = await generateText({
    //   model: openai("gpt-4"),
    //   prompt: `Context: Current file is ${currentFile.name}\n\nCode:\n${currentCode}\n\nUser: ${userMessage}`,
    // })

    // Simulated responses based on mode and context
    const responses = {
      chat: [
        `I can see you're working on ${currentFile.name}. How can I help you with this file?`,
        "I'm here to assist with your coding needs. What specific task would you like help with?",
        "Based on your current code, I can help with improvements, debugging, or new features.",
      ],
      code: [
        `Here's a code suggestion for ${currentFile.name}:\n\n\`\`\`typescript\n// Enhanced version of your code\nfunction improvedFunction() {\n  // Implementation here\n  return result;\n}\n\`\`\``,
        "I can generate code for your specific use case. What functionality do you need?",
        "Let me create a code snippet that addresses your requirements.",
      ],
      debug: [
        `I've analyzed your ${currentFile.name} file. Here are potential issues I found:\n\n1. **Type Safety**: Consider adding proper TypeScript types\n2. **Error Handling**: Add try-catch blocks for async operations\n3. **Performance**: Optimize the rendering logic`,
        "I can help debug your code. What specific error or issue are you encountering?",
        "Let me review your code for potential bugs and improvements.",
      ],
      explain: [
        `Let me explain what's happening in ${currentFile.name}:\n\nThis file appears to be a React component that handles user interactions. The main functionality includes:\n\n• State management with useState\n• Event handling for user actions\n• Conditional rendering based on state`,
        "I can explain any part of your code. What specific section would you like me to clarify?",
        "Here's a breakdown of the code structure and its purpose.",
      ],
    }

    const modeResponses = responses[mode as keyof typeof responses] || responses.chat
    return modeResponses[Math.floor(Math.random() * modeResponses.length)]
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    const messageId = Date.now().toString()
    setInput("")

    // Add user message
    const newUserMessage = {
      id: messageId,
      role: "user" as const,
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])
    setIsTyping(true)

    try {
      // Get AI response with context
      const aiResponse = await getAIResponse(userMessage, chatMode)

      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI response error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: "I apologize, but I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat cleared. How can I help you with your code?",
        timestamp: new Date(),
      },
    ])
  }

  const formatMessage = (content: string) => {
    // Simple code block detection and formatting
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = content.split(codeBlockRegex)

    return parts.map((part, index) => {
      if (index % 3 === 2) {
        // This is code content
        return (
          <pre key={index} className="bg-muted p-3 rounded-md mt-2 overflow-x-auto">
            <code className="text-sm font-mono">{part}</code>
          </pre>
        )
      } else if (index % 3 === 1) {
        // This is language identifier, skip
        return null
      } else {
        // This is regular text
        return (
          <div key={index} className="whitespace-pre-wrap">
            {part}
          </div>
        )
      }
    })
  }

  const quickActions = [
    { label: "Explain this code", action: () => setInput("Explain what this code does") },
    { label: "Find bugs", action: () => setInput("Help me find bugs in this code") },
    { label: "Optimize performance", action: () => setInput("How can I optimize this code for better performance?") },
    { label: "Add error handling", action: () => setInput("Add proper error handling to this code") },
  ]

  return (
    <Card className="w-96 h-full bg-card border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={clearChat}>
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* AI Mode Tabs */}
        <Tabs value={chatMode} onValueChange={(value) => setChatMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">
              <Code className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="debug" className="text-xs">
              <Bug className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="explain" className="text-xs">
              <Lightbulb className="w-3 h-3" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Current file context */}
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {getFileIcon(currentFile.name)}
          <span>Context: {currentFile.name}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border"
                }`}
              >
                <div className="space-y-1">
                  {formatMessage(message.content)}
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {message.role === "assistant" && (
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground p-3 rounded-lg text-sm border border-border">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-primary animate-pulse" />
                  <span>AI is thinking...</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border space-y-2">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-1">
          {quickActions.map((action, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-secondary/80"
              onClick={action.action}
            >
              {action.label}
            </Badge>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`Ask AI to ${chatMode === "chat" ? "help" : chatMode}...`}
            className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isTyping}
          />
          <Button size="sm" onClick={sendMessage} disabled={isTyping || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Mode description */}
        <div className="text-xs text-muted-foreground">
          {chatMode === "chat" && "General conversation and assistance"}
          {chatMode === "code" && "Generate and suggest code"}
          {chatMode === "debug" && "Find and fix bugs"}
          {chatMode === "explain" && "Explain code functionality"}
        </div>
      </div>
    </Card>
  )
}

function TerminalComponent({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  const [terminals, setTerminals] = useState([
    { id: "1", name: "Terminal 1", history: [], currentDirectory: "~/cursor-clone" },
  ])
  const [activeTerminal, setActiveTerminal] = useState("1")
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  interface TerminalEntry {
    id: string
    type: "command" | "output" | "error"
    content: string
    timestamp: Date
  }

  // Simulate command execution
  const executeCommand = (command: string, terminalId: string) => {
    const terminal = terminals.find((t) => t.id === terminalId)
    if (!terminal) return

    const newEntry: TerminalEntry = {
      id: Date.now().toString(),
      type: "command",
      content: `${terminal.currentDirectory} $ ${command}`,
      timestamp: new Date(),
    }

    let outputEntry: TerminalEntry | null = null

    // Simulate different commands
    switch (command.trim().toLowerCase()) {
      case "ls":
      case "dir":
        outputEntry = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content: "src/\npublic/\npackage.json\ntsconfig.json\nREADME.md\n.gitignore\nnode_modules/",
          timestamp: new Date(),
        }
        break
      case "pwd":
        outputEntry = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content: terminal.currentDirectory,
          timestamp: new Date(),
        }
        break
      case "npm install":
        outputEntry = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content:
            "Installing dependencies...\n✓ react@18.2.0\n✓ next@14.0.0\n✓ typescript@5.0.0\n\nInstallation complete!",
          timestamp: new Date(),
        }
        break
      case "npm run dev":
        outputEntry = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content:
            "Starting development server...\n\n> cursor-clone@1.0.0 dev\n> next dev\n\n✓ Ready on http://localhost:3000",
          timestamp: new Date(),
        }
        break
      case "git status":
        outputEntry = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content:
            "On branch main\nChanges not staged for commit:\n  modified:   src/app.tsx\n  modified:   src/components/Button.tsx\n\nno changes added to commit",
          timestamp: new Date(),
        }
        break
      case "git log --oneline":
        outputEntry = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content: "a1b2c3d Add AI chat integration\n4e5f6g7 Implement file explorer\n8h9i0j1 Initial commit",
          timestamp: new Date(),
        }
        break
      case "clear":
        setTerminals((prev) => prev.map((t) => (t.id === terminalId ? { ...t, history: [] } : t)))
        return
      case "help":
        outputEntry = {
          id: (Date.now() + 1).toString(),
          type: "output",
          content:
            "Available commands:\n  ls, dir     - List directory contents\n  pwd         - Print working directory\n  cd <dir>    - Change directory\n  npm install - Install dependencies\n  npm run dev - Start development server\n  git status  - Show git status\n  git log     - Show commit history\n  clear       - Clear terminal\n  help        - Show this help",
          timestamp: new Date(),
        }
        break
      default:
        if (command.startsWith("cd ")) {
          const newDir = command.substring(3).trim()
          setTerminals((prev) =>
            prev.map((t) =>
              t.id === terminalId
                ? { ...t, currentDirectory: newDir.startsWith("/") ? newDir : `${t.currentDirectory}/${newDir}` }
                : t,
            ),
          )
          return
        } else if (command.trim()) {
          outputEntry = {
            id: (Date.now() + 1).toString(),
            type: "error",
            content: `Command not found: ${command}\nType 'help' for available commands.`,
            timestamp: new Date(),
          }
        }
        break
    }

    const newHistory = [newEntry]
    if (outputEntry) {
      newHistory.push(outputEntry)
    }

    setTerminals((prev) =>
      prev.map((t) => (t.id === terminalId ? { ...t, history: [...t.history, ...newHistory] } : t)),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add to command history
    setCommandHistory((prev) => [...prev, input])
    setHistoryIndex(-1)

    // Execute command
    executeCommand(input, activeTerminal)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    }
  }

  const addNewTerminal = () => {
    const newId = Date.now().toString()
    const newTerminal = {
      id: newId,
      name: `Terminal ${terminals.length + 1}`,
      history: [],
      currentDirectory: "~/cursor-clone",
    }
    setTerminals((prev) => [...prev, newTerminal])
    setActiveTerminal(newId)
  }

  const closeTerminal = (terminalId: string) => {
    if (terminals.length === 1) return // Don't close the last terminal

    setTerminals((prev) => prev.filter((t) => t.id !== terminalId))
    if (activeTerminal === terminalId) {
      setActiveTerminal(terminals.find((t) => t.id !== terminalId)?.id || terminals[0].id)
    }
  }

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [terminals])

  // Focus input when terminal becomes visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  if (!isVisible) return null

  const currentTerminal = terminals.find((t) => t.id === activeTerminal)

  return (
    <Card className="absolute bottom-0 left-0 right-0 h-80 bg-card border-border border-t-2 border-x-0 border-b-0 rounded-t-lg shadow-2xl z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-semibold text-sm">Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110">
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110">
            <Maximize2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110 hover:bg-destructive/10"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTerminal} onValueChange={setActiveTerminal} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-1 bg-muted/50 border-b border-border">
          <TabsList className="h-8 bg-transparent p-0">
            {terminals.map((terminal) => (
              <TabsTrigger
                key={terminal.id}
                value={terminal.id}
                className="relative h-7 px-3 text-xs data-[state=active]:bg-background transition-all duration-200 hover:bg-background/50"
              >
                {terminal.name}
                {terminals.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 ml-1 transition-all duration-200 hover:scale-110 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTerminal(terminal.id)
                    }}
                  >
                    <X className="w-2 h-2" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 transition-all duration-200 hover:scale-110"
            onClick={addNewTerminal}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {terminals.map((terminal) => (
          <TabsContent key={terminal.id} value={terminal.id} className="flex-1 flex flex-col m-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-1 font-mono text-sm">
                {terminal.history.length === 0 && (
                  <div className="text-muted-foreground">
                    Welcome to Cursor Clone Terminal
                    <br />
                    Type 'help' for available commands
                    <br />
                  </div>
                )}
                {terminal.history.map((entry) => (
                  <div
                    key={entry.id}
                    className={`whitespace-pre-wrap ${
                      entry.type === "command"
                        ? "text-primary font-medium"
                        : entry.type === "error"
                          ? "text-destructive"
                          : "text-foreground"
                    }`}
                  >
                    {entry.content}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-primary font-mono text-sm font-medium">{terminal.currentDirectory} $</span>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent border-none p-0 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoComplete="off"
                />
              </form>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}

function ProjectManagement({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [projectSettings, setProjectSettings] = useState({
    name: "cursor-clone",
    description: "AI-powered code editor clone",
    version: "1.0.0",
    author: "Developer",
    license: "MIT",
    autoSave: true,
    formatOnSave: true,
    linting: true,
    darkMode: true,
    aiAssistance: true,
  })

  const [gitStatus, setGitStatus] = useState({
    branch: "main",
    commits: 12,
    uncommittedChanges: 2,
    lastCommit: "2 hours ago",
    remoteUrl: "https://github.com/user/cursor-clone.git",
    collaborators: ["Alice", "Bob", "Charlie"],
  })

  const [projectStats, setProjectStats] = useState({
    totalFiles: 24,
    totalLines: 1847,
    languages: [
      { name: "TypeScript", percentage: 65, color: "bg-blue-500" },
      { name: "CSS", percentage: 20, color: "bg-pink-500" },
      { name: "JSON", percentage: 10, color: "bg-yellow-500" },
      { name: "Markdown", percentage: 5, color: "bg-gray-500" },
    ],
    recentActivity: [
      { action: "Modified", file: "app.tsx", time: "5 minutes ago", type: "edit" },
      { action: "Created", file: "Terminal.tsx", time: "1 hour ago", type: "create" },
      { action: "Deleted", file: "old-component.tsx", time: "2 hours ago", type: "delete" },
      { action: "Committed", file: "Add AI integration", time: "3 hours ago", type: "commit" },
    ],
    buildStatus: "success",
    testStatus: "passing",
    deploymentStatus: "deployed",
  })

  const [recentProjects, setRecentProjects] = useState([
    { name: "cursor-clone", path: "/projects/cursor-clone", lastOpened: "Now", status: "active" },
    { name: "react-dashboard", path: "/projects/react-dashboard", lastOpened: "Yesterday", status: "recent" },
    { name: "nextjs-blog", path: "/projects/nextjs-blog", lastOpened: "3 days ago", status: "recent" },
    { name: "vue-portfolio", path: "/projects/vue-portfolio", lastOpened: "1 week ago", status: "recent" },
  ])

  const handleSettingChange = (key: string, value: any) => {
    setProjectSettings((prev) => ({ ...prev, [key]: value }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "passing":
      case "deployed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "error":
      case "failing":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "edit":
        return <Edit3 className="w-4 h-4 text-blue-500" />
      case "create":
        return <Plus className="w-4 h-4 text-green-500" />
      case "delete":
        return <Trash2 className="w-4 h-4 text-red-500" />
      case "commit":
        return <GitCommit className="w-4 h-4 text-purple-500" />
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Project Management
          </DialogTitle>
          <DialogDescription>
            Manage your project settings, git integration, and workspace configuration.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="transition-all duration-200">
              Overview
            </TabsTrigger>
            <TabsTrigger value="git" className="transition-all duration-200">
              Git
            </TabsTrigger>
            <TabsTrigger value="settings" className="transition-all duration-200">
              Settings
            </TabsTrigger>
            <TabsTrigger value="workspace" className="transition-all duration-200">
              Workspace
            </TabsTrigger>
            <TabsTrigger value="insights" className="transition-all duration-200">
              Insights
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent
              value="overview"
              className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Project Info</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{projectSettings.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span>{projectSettings.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Files:</span>
                      <span>{projectStats.totalFiles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lines:</span>
                      <span>{projectStats.totalLines.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Status</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Build</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(projectStats.buildStatus)}
                        <span className="text-sm capitalize">{projectStats.buildStatus}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tests</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(projectStats.testStatus)}
                        <span className="text-sm capitalize">{projectStats.testStatus}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Deployment</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(projectStats.deploymentStatus)}
                        <span className="text-sm capitalize">{projectStats.deploymentStatus}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Recent Activity</h3>
                </div>
                <div className="space-y-2">
                  {projectStats.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <span className="text-sm">
                          <span className="font-medium">{activity.action}</span> {activity.file}
                        </span>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="git" className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Repository Status</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Branch</span>
                      <Badge variant="secondary">{gitStatus.branch}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Commits</span>
                      <span className="text-sm font-medium">{gitStatus.commits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Uncommitted Changes</span>
                      <Badge variant={gitStatus.uncommittedChanges > 0 ? "destructive" : "secondary"}>
                        {gitStatus.uncommittedChanges}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Commit</span>
                      <span className="text-sm">{gitStatus.lastCommit}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Collaborators</h3>
                  </div>
                  <div className="space-y-2">
                    {gitStatus.collaborators.map((collaborator, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                          {collaborator[0]}
                        </div>
                        <span className="text-sm">{collaborator}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-4 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <GitCommit className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Git Actions</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    <GitCommit className="w-4 h-4 mr-2" />
                    Commit Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    <GitPullRequest className="w-4 h-4 mr-2" />
                    Create Pull Request
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    <GitBranch className="w-4 h-4 mr-2" />
                    New Branch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    <History className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent
              value="settings"
              className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Editor Settings</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-save" className="text-sm">
                        Auto Save
                      </Label>
                      <Switch
                        id="auto-save"
                        checked={projectSettings.autoSave}
                        onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="format-save" className="text-sm">
                        Format on Save
                      </Label>
                      <Switch
                        id="format-save"
                        checked={projectSettings.formatOnSave}
                        onCheckedChange={(checked) => handleSettingChange("formatOnSave", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="linting" className="text-sm">
                        Enable Linting
                      </Label>
                      <Switch
                        id="linting"
                        checked={projectSettings.linting}
                        onCheckedChange={(checked) => handleSettingChange("linting", checked)}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Appearance</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode" className="text-sm">
                        Dark Mode
                      </Label>
                      <Switch
                        id="dark-mode"
                        checked={projectSettings.darkMode}
                        onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-assistance" className="text-sm">
                        AI Assistance
                      </Label>
                      <Switch
                        id="ai-assistance"
                        checked={projectSettings.aiAssistance}
                        onCheckedChange={(checked) => handleSettingChange("aiAssistance", checked)}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Project Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name" className="text-sm">
                      Project Name
                    </Label>
                    <Input
                      id="project-name"
                      value={projectSettings.name}
                      onChange={(e) => handleSettingChange("name", e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-version" className="text-sm">
                      Version
                    </Label>
                    <Input
                      id="project-version"
                      value={projectSettings.version}
                      onChange={(e) => handleSettingChange("version", e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-author" className="text-sm">
                      Author
                    </Label>
                    <Input
                      id="project-author"
                      value={projectSettings.author}
                      onChange={(e) => handleSettingChange("author", e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-license" className="text-sm">
                      License
                    </Label>
                    <Input
                      id="project-license"
                      value={projectSettings.license}
                      onChange={(e) => handleSettingChange("license", e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent
              value="workspace"
              className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            >
              <Card className="p-4 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <FolderIcon className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Recent Projects</h3>
                </div>
                <div className="space-y-2">
                  {recentProjects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FolderIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{project.name}</div>
                          <div className="text-xs text-muted-foreground">{project.path}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                        <span className="text-xs text-muted-foreground">{project.lastOpened}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent transition-all duration-200 hover:scale-105"
                  >
                    <FolderIcon className="w-4 h-4 mr-2" />
                    Open Folder
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent transition-all duration-200 hover:scale-105"
                  >
                    <GitBranch className="w-4 h-4 mr-2" />
                    Clone Repository
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start bg-transparent transition-all duration-200 hover:scale-105"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent
              value="insights"
              className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            >
              <Card className="p-4 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Language Distribution</h3>
                </div>
                <div className="space-y-3">
                  {projectStats.languages.map((lang, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{lang.name}</span>
                        <span>{lang.percentage}%</span>
                      </div>
                      <Progress value={lang.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                  <div className="text-2xl font-bold text-primary">{projectStats.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">Total Files</div>
                </Card>
                <Card className="p-4 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                  <div className="text-2xl font-bold text-primary">{projectStats.totalLines.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Lines of Code</div>
                </Card>
                <Card className="p-4 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                  <div className="text-2xl font-bold text-primary">{gitStatus.commits}</div>
                  <div className="text-sm text-muted-foreground">Commits</div>
                </Card>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default function Home() {
  const [currentFile, setCurrentFile] = useState<FileItem>({
    id: "13",
    name: "app.tsx",
    type: "file",
    path: "/src/app.tsx",
  })
  const [code, setCode] = useState(`import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App`)

  const [isTerminalVisible, setIsTerminalVisible] = useState(false)
  const [isProjectManagementOpen, setIsProjectManagementOpen] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [commandPalette, setCommandPalette] = useState(false)
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: "success" | "error" | "info" }>
  >([])

  const handleKeyboardShortcuts = useCallback(
    (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPalette(true)
      }
      // Cmd/Ctrl + ` for terminal
      if ((e.metaKey || e.ctrlKey) && e.key === "`") {
        e.preventDefault()
        setIsTerminalVisible(!isTerminalVisible)
      }
      // Cmd/Ctrl + , for settings
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault()
        setIsProjectManagementOpen(true)
      }
      // Cmd/Ctrl + S for save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        addNotification("File saved successfully!", "success")
      }
      // Cmd/Ctrl + ? for keyboard shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === "?") {
        e.preventDefault()
        setShowKeyboardShortcuts(true)
      }
    },
    [isTerminalVisible],
  )

  const addNotification = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts)
    return () => document.removeEventListener("keydown", handleKeyboardShortcuts)
  }, [handleKeyboardShortcuts])

  const handleFileSelect = (file: FileItem) => {
    setCurrentFile(file)
    // In a real app, you'd load the file content here
    const sampleCode = {
      "Button.tsx": `import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border border-input bg-background hover:bg-accent': variant === 'outline',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}`,
      "package.json": `{
  "name": "cursor-clone",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}`,
    }

    setCode(
      sampleCode[file.name as keyof typeof sampleCode] ||
        `// Content of ${file.name}\n\n// This is a placeholder for the actual file content`,
    )
  }

  return (
    <TooltipProvider>
      <div className="h-screen bg-background text-foreground flex flex-col relative">
        <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-xs">C</span>
              </div>
              <span className="font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Cursor Clone
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="w-4 h-4" />
              <span>main</span>
              <Badge variant="secondary" className="text-xs animate-pulse">
                2 changes
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCommandPalette(true)}
                  className="transition-all duration-200 hover:scale-105 hover:bg-primary/10"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Command Palette (⌘K)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsTerminalVisible(!isTerminalVisible)}
                  className={`transition-all duration-200 hover:scale-105 ${
                    isTerminalVisible ? "bg-primary/10 text-primary shadow-sm" : ""
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Terminal (⌘`)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsProjectManagementOpen(true)}
                  className="transition-all duration-200 hover:scale-105 hover:bg-primary/10"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Project Settings (⌘,)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="transition-all duration-200 hover:scale-105 hover:bg-primary/10"
                >
                  <Keyboard className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keyboard Shortcuts (⌘?)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* File Explorer */}
          <FileExplorer onFileSelect={handleFileSelect} />

          <Separator orientation="vertical" />

          {/* Editor Area */}
          <div className="flex-1 p-4">
            <CodeEditor value={code} onChange={setCode} language="typescript" fileName={currentFile.name} />
          </div>

          <Separator orientation="vertical" />

          <AIChat currentFile={currentFile} currentCode={code} />
        </div>

        <TerminalComponent isVisible={isTerminalVisible} onClose={() => setIsTerminalVisible(false)} />
        <ProjectManagement isOpen={isProjectManagementOpen} onClose={() => setIsProjectManagementOpen(false)} />

        <Dialog open={commandPalette} onOpenChange={setCommandPalette}>
          <DialogContent className="max-w-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Command Palette
              </DialogTitle>
              <DialogDescription>Type a command or search for files, actions, and settings.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Type a command..."
                className="text-lg h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[
                  {
                    icon: Terminal,
                    label: "Toggle Terminal",
                    shortcut: "⌘`",
                    action: () => setIsTerminalVisible(!isTerminalVisible),
                  },
                  {
                    icon: Settings,
                    label: "Open Settings",
                    shortcut: "⌘,",
                    action: () => setIsProjectManagementOpen(true),
                  },
                  {
                    icon: Save,
                    label: "Save File",
                    shortcut: "⌘S",
                    action: () => addNotification("File saved!", "success"),
                  },
                  {
                    icon: Play,
                    label: "Run Code",
                    shortcut: "⌘R",
                    action: () => addNotification("Running code...", "info"),
                  },
                  {
                    icon: GitCommit,
                    label: "Commit Changes",
                    shortcut: "⌘⇧C",
                    action: () => addNotification("Committing changes...", "info"),
                  },
                  {
                    icon: Keyboard,
                    label: "Keyboard Shortcuts",
                    shortcut: "⌘?",
                    action: () => setShowKeyboardShortcuts(true),
                  },
                ].map((command, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => {
                      command.action()
                      setCommandPalette(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <command.icon className="w-4 h-4 text-primary" />
                      <span>{command.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {command.shortcut}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
          <DialogContent className="max-w-3xl animate-in fade-in-0 zoom-in-95 duration-200">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription>Master these shortcuts to boost your productivity.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-primary">General</h3>
                <div className="space-y-2">
                  {[
                    { keys: ["⌘", "K"], description: "Command Palette" },
                    { keys: ["⌘", "S"], description: "Save File" },
                    { keys: ["⌘", ","], description: "Open Settings" },
                    { keys: ["⌘", "?"], description: "Show Shortcuts" },
                  ].map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <Badge key={keyIndex} variant="outline" className="text-xs font-mono">
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Development</h3>
                <div className="space-y-2">
                  {[
                    { keys: ["⌘", "`"], description: "Toggle Terminal" },
                    { keys: ["⌘", "R"], description: "Run Code" },
                    { keys: ["⌘", "⇧", "C"], description: "Commit Changes" },
                    { keys: ["⌘", "⇧", "P"], description: "Git Push" },
                  ].map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <Badge key={keyIndex} variant="outline" className="text-xs font-mono">
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg shadow-lg backdrop-blur-sm border animate-in slide-in-from-right-4 duration-300 ${
                notification.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300"
                  : notification.type === "error"
                    ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === "success" && <CheckCircle className="w-4 h-4" />}
                {notification.type === "error" && <XCircle className="w-4 h-4" />}
                {notification.type === "info" && <AlertCircle className="w-4 h-4" />}
                <span className="text-sm font-medium">{notification.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
