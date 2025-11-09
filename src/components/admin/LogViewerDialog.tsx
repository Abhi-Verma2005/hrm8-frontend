import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, RefreshCw } from 'lucide-react';
import { logger, LogEntry, LogLevel } from '@/lib/logger';

interface LogViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogViewerDialog({ open, onOpenChange }: LogViewerDialogProps) {
  const [logs, setLogs] = useState<LogEntry[]>(logger.getRecentLogs(100));
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');

  const refreshLogs = () => {
    setLogs(logger.getRecentLogs(100));
  };

  const downloadLogs = () => {
    const logsJson = logger.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const filteredLogs = logs.filter(log => 
    filter === 'all' || log.level === filter
  );

  const getLevelBadge = (level: LogLevel) => {
    const variants = {
      [LogLevel.DEBUG]: 'secondary',
      [LogLevel.INFO]: 'default',
      [LogLevel.WARN]: 'outline',
      [LogLevel.ERROR]: 'destructive',
    } as const;

    const labels = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
    };

    return (
      <Badge variant={variants[level]} className="text-xs">
        {labels[level]}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Application Logs</DialogTitle>
          <DialogDescription>
            View recent application logs for debugging
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-muted' : ''}
          >
            All ({logs.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(LogLevel.DEBUG)}
            className={filter === LogLevel.DEBUG ? 'bg-muted' : ''}
          >
            Debug ({logs.filter(l => l.level === LogLevel.DEBUG).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(LogLevel.INFO)}
            className={filter === LogLevel.INFO ? 'bg-muted' : ''}
          >
            Info ({logs.filter(l => l.level === LogLevel.INFO).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(LogLevel.WARN)}
            className={filter === LogLevel.WARN ? 'bg-muted' : ''}
          >
            Warnings ({logs.filter(l => l.level === LogLevel.WARN).length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(LogLevel.ERROR)}
            className={filter === LogLevel.ERROR ? 'bg-muted' : ''}
          >
            Errors ({logs.filter(l => l.level === LogLevel.ERROR).length})
          </Button>
          
          <div className="flex-1" />
          
          <Button variant="outline" size="sm" onClick={refreshLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={downloadLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearLogs}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <ScrollArea className="flex-1 border rounded-md p-4">
          <div className="space-y-3 font-mono text-sm">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No logs to display
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-2">
                    {getLevelBadge(log.level)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="mb-2 font-medium">{log.message}</div>
                  
                  {log.context && (
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  )}
                  
                  {log.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Stack trace
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto mt-2 whitespace-pre-wrap">
                        {log.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
