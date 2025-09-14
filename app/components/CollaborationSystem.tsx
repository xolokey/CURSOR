'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  MessageSquare, 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  Code,
  Star,
  ThumbsUp,
  AlertCircle,
  UserPlus,
  Video,
  Phone,
  Share2,
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'designer' | 'manager' | 'qa';
  status: 'online' | 'away' | 'busy' | 'offline';
  avatar: string;
  currentTask?: string;
  lastActive: Date;
}

interface CodeReview {
  id: string;
  title: string;
  author: string;
  status: 'open' | 'approved' | 'changes_requested' | 'merged';
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  comments: number;
  approvals: number;
  createdAt: Date;
  branch: string;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  type: 'documentation' | 'tutorial' | 'best_practice' | 'troubleshooting';
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'file' | 'system';
}

export default function CollaborationSystem() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'developer',
      status: 'online',
      avatar: 'JD',
      currentTask: 'Working on AI features',
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'designer',
      status: 'away',
      avatar: 'JS',
      currentTask: 'UI/UX design',
      lastActive: new Date(Date.now() - 300000)
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'manager',
      status: 'busy',
      avatar: 'MJ',
      currentTask: 'Project planning',
      lastActive: new Date(Date.now() - 600000)
    }
  ]);

  const [codeReviews, setCodeReviews] = useState<CodeReview[]>([
    {
      id: '1',
      title: 'Add AI coding intelligence features',
      author: 'John Doe',
      status: 'open',
      filesChanged: 12,
      linesAdded: 245,
      linesRemoved: 18,
      comments: 3,
      approvals: 1,
      createdAt: new Date(Date.now() - 3600000),
      branch: 'feature/ai-intelligence'
    },
    {
      id: '2',
      title: 'Fix security vulnerabilities',
      author: 'Jane Smith',
      status: 'approved',
      filesChanged: 5,
      linesAdded: 89,
      linesRemoved: 45,
      comments: 1,
      approvals: 2,
      createdAt: new Date(Date.now() - 7200000),
      branch: 'fix/security-patch'
    }
  ]);

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'AI Development Best Practices',
      content: 'Comprehensive guide to building AI-powered applications...',
      author: 'John Doe',
      tags: ['ai', 'development', 'best-practices'],
      type: 'best_practice',
      views: 156,
      likes: 23,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      title: 'Testing Strategy for AI Systems',
      content: 'How to effectively test AI-powered features...',
      author: 'Jane Smith',
      tags: ['testing', 'ai', 'qa'],
      type: 'tutorial',
      views: 89,
      likes: 15,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 7200000)
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      author: 'John Doe',
      content: 'Hey team! I just pushed the new AI features. Can someone review?',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    {
      id: '2',
      author: 'Jane Smith',
      content: 'I\'ll take a look at the UI components. The design looks great!',
      timestamp: new Date(Date.now() - 1200000),
      type: 'text'
    },
    {
      id: '3',
      author: 'Mike Johnson',
      content: 'Excellent work everyone! The AI integration is looking solid.',
      timestamp: new Date(Date.now() - 600000),
      type: 'text'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState('team');

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      author: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // Get team statistics
  const getTeamStats = () => {
    return {
      total: teamMembers.length,
      online: teamMembers.filter(m => m.status === 'online').length,
      busy: teamMembers.filter(m => m.status === 'busy').length,
      away: teamMembers.filter(m => m.status === 'away').length
    };
  };

  const teamStats = getTeamStats();

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Users className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold">Collaboration & Team</h2>
            <Badge variant="default">
              {teamStats.online} Online
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Video className="w-4 h-4 mr-2" />
              Start Meeting
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <div className="space-y-4">
            <div
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedTab === 'team' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedTab('team')}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">Team Members</span>
              </div>
            </div>
            
            <div
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedTab === 'reviews' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedTab('reviews')}
            >
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4" />
                <span className="font-medium">Code Reviews</span>
              </div>
            </div>
            
            <div
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedTab === 'knowledge' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedTab('knowledge')}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Knowledge Base</span>
              </div>
            </div>
            
            <div
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedTab === 'chat' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedTab('chat')}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">Team Chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Team Statistics */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{teamStats.total}</div>
                <div className="text-sm text-gray-400">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{teamStats.online}</div>
                <div className="text-sm text-gray-400">Online</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{teamStats.busy}</div>
                <div className="text-sm text-gray-400">Busy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{teamStats.away}</div>
                <div className="text-sm text-gray-400">Away</div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {selectedTab === 'team' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Members */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 bg-gray-700 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              member.status === 'online' ? 'bg-green-500' :
                              member.status === 'busy' ? 'bg-red-500' :
                              member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}>
                              {member.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{member.name}</span>
                                <Badge 
                                  variant={
                                    member.role === 'developer' ? 'default' :
                                    member.role === 'designer' ? 'secondary' :
                                    member.role === 'manager' ? 'outline' : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {member.role}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-400">
                                {member.currentTask || 'No current task'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Last active: {member.lastActive.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Activity */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Team Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Recent Activity</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-300">John merged PR #123</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Jane pushed new commits</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Mike updated documentation</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Team Goals</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Sprint Progress</span>
                            <span className="text-sm text-green-400">78%</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                {/* Code Reviews */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GitBranch className="w-5 h-5 mr-2" />
                      Code Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {codeReviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {review.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-400" />}
                              {review.status === 'open' && <Clock className="w-4 h-4 text-yellow-400" />}
                              {review.status === 'changes_requested' && <XCircle className="w-4 h-4 text-red-400" />}
                              <span className="font-medium">{review.title}</span>
                            </div>
                            <Badge 
                              variant={
                                review.status === 'approved' ? 'default' :
                                review.status === 'open' ? 'secondary' :
                                review.status === 'changes_requested' ? 'destructive' : 'outline'
                              }
                              className="text-xs"
                            >
                              {review.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">
                            by {review.author} • {review.branch}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span>{review.filesChanged} files changed</span>
                            <span className="text-green-400">+{review.linesAdded}</span>
                            <span className="text-red-400">-{review.linesRemoved}</span>
                            <span>{review.comments} comments</span>
                            <span>{review.approvals} approvals</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'knowledge' && (
              <div className="space-y-6">
                {/* Knowledge Base */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Knowledge Base
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {knowledgeBase.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{item.title}</span>
                            <Badge 
                              variant={
                                item.type === 'best_practice' ? 'default' :
                                item.type === 'tutorial' ? 'secondary' :
                                item.type === 'documentation' ? 'outline' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {item.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">
                            by {item.author} • {item.views} views • {item.likes} likes
                          </div>
                          <div className="text-sm text-gray-300 mb-2">
                            {item.content.substring(0, 100)}...
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'chat' && (
              <div className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.author === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.author === 'You' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        <div className="text-xs text-gray-400 mb-1">
                          {message.author} • {message.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="text-sm">{message.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat Input */}
                <div className="border-t border-gray-700 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                    />
                    <Button onClick={sendMessage} size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}