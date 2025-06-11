import { Form } from '@remix-run/react';
import { Flag } from 'lucide-react';
import * as React from 'react';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';

interface Props {
  commentId: string;
}

export function ReportCommentDialog({ commentId }: Readonly<Props>) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Report comment">
          <Flag className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report comment</DialogTitle>
          <DialogDescription>
            Provide a reason for reporting this comment.
          </DialogDescription>
        </DialogHeader>
        <Form method="POST" className="space-y-4" onSubmit={() => setOpen(false)}>
          <Input type="hidden" name="type" value="report_comment" />
          <Input type="hidden" name="comment_id" value={commentId} />
          <div className="space-y-2">
            <label htmlFor="reason_type" className="text-sm font-medium">
              Reason
            </label>
            <Select name="reason_type" required>
              <SelectTrigger id="reason_type">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPAM">Spam</SelectItem>
                <SelectItem value="INAPPROPRIATE">Inappropriate</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="detail" className="text-sm font-medium">
              Additional details
            </label>
            <Textarea id="detail" name="detail" placeholder="Tell us more" />
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// I love the internet, they gave me this code.