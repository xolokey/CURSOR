import { NextRequest, NextResponse } from 'next/server';
import { AdvancedAI } from '@/lib/advanced-ai';

const advancedAI = new AdvancedAI(
  process.env.GEMINI_API_KEY || '',
  process.env.PERPLEXITY_API_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { taskId, stepId } = await request.json();

    if (!taskId || !stepId) {
      return NextResponse.json(
        { error: 'TaskId and stepId are required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would store and retrieve tasks from a database
    // For now, we'll create a mock task and execute the step
    const mockTask = {
      id: taskId,
      description: 'Mock task',
      status: 'in_progress' as const,
      steps: [
        {
          id: stepId,
          description: 'Mock step',
          status: 'pending' as const,
          action: 'analyze' as const,
        }
      ],
    };

    const updatedStep = await advancedAI.executeAgentStep(mockTask, stepId);
    
    // Update the task with the executed step
    const updatedTask = {
      ...mockTask,
      steps: mockTask.steps.map(step => 
        step.id === stepId ? updatedStep : step
      ),
    };

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Execute step API error:', error);
    return NextResponse.json(
      { error: 'Failed to execute agent step' },
      { status: 500 }
    );
  }
}
