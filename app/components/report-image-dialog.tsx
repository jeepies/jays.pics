import { Form } from '@remix-run/react'
import * as React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { Input } from '~/components/ui/input'

interface Props {
  imageId: string
}

export function ReportImageDialog({ imageId }: Props) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report image</DialogTitle>
          <DialogDescription>
            Provide a reason for reporting this image.
          </DialogDescription>
        </DialogHeader>
        <Form
          method="POST"
          className="space-y-4"
          onSubmit={() => setOpen(false)}
        >
          <Input type="hidden" name="type" value="report_image" />
          <Input type="hidden" name="image_id" value={imageId} />
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
                <SelectItem value="COPYRIGHT">Copyright</SelectItem>
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
  )
}