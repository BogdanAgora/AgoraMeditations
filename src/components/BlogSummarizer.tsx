'use client';

import { useState } from 'react';
import { summarizeBlogPost, type SummarizeBlogPostInput, type SummarizeBlogPostOutput } from '@/ai/flows/summarize-blog-post';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogSummarizerProps {
  markdownContent: string;
}

export default function BlogSummarizer({ markdownContent }: BlogSummarizerProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const input: SummarizeBlogPostInput = { markdownContent };
      const result: SummarizeBlogPostOutput = await summarizeBlogPost(input);
      setSummary(result.summary);
    } catch (e) {
      console.error("Failed to summarize blog post:", e);
      setError("Sorry, we couldn't generate a summary at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-8">
      <Button onClick={handleSummarize} disabled={isLoading} className="smooth-transition bg-accent text-accent-foreground hover:bg-accent/90">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Generating Summary...' : 'Generate AI Summary'}
      </Button>

      {error && (
        <Card className="mt-4 border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {summary && !error && (
        <Card className="mt-6 bg-primary/5 border-primary/30 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-primary flex items-center">
              <Wand2 className="mr-2 h-5 w-5" />
              AI Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-line">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
