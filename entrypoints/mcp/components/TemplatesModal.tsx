import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, Trash2, X } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { IconButton } from '../../shared/components/ui/IconButton';
import type { PromptTemplate } from '../types';

type TemplatesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: PromptTemplate[];
  defaultPromptId: string;
  templateName: string;
  templateContent: string;
  templateQuery: string;
  editingTemplateId: string | null;
  draftName: string;
  draftContent: string;
  onTemplateNameChange: (next: string) => void;
  onTemplateContentChange: (next: string) => void;
  onTemplateQueryChange: (next: string) => void;
  onDraftNameChange: (next: string) => void;
  onDraftContentChange: (next: string) => void;
  onAddTemplate: () => void;
  onSetDefault: (id: string) => void;
  onEditTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
};

export function TemplatesModal({
  open,
  onOpenChange,
  templates,
  defaultPromptId,
  templateName,
  templateContent,
  templateQuery,
  editingTemplateId,
  draftName,
  draftContent,
  onTemplateNameChange,
  onTemplateContentChange,
  onTemplateQueryChange,
  onDraftNameChange,
  onDraftContentChange,
  onAddTemplate,
  onSetDefault,
  onEditTemplate,
  onDeleteTemplate,
  onCancelEdit,
  onSaveEdit,
}: TemplatesModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content surface p-4 max-w-4xl w-full">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="section-title">Prompt Templates</Dialog.Title>
              <div className="muted">Create, apply, or edit templates for the sidepanel client.</div>
            </div>
            <IconButton aria-label="Close" title="Close" onClick={() => onOpenChange(false)}>
              <X size={14} />
            </IconButton>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-3">
              <div className="surface-soft p-3 grid gap-2">
                <div className="text-sm font-semibold">New template</div>
                <input
                  value={templateName}
                  onChange={(e) => onTemplateNameChange(e.target.value)}
                  placeholder="Template name"
                />
                <textarea
                  rows={4}
                  value={templateContent}
                  onChange={(e) => onTemplateContentChange(e.target.value)}
                  placeholder="Template content"
                />
                <div className="row justify-end">
                  <Button onClick={onAddTemplate}>Add template</Button>
                </div>
              </div>

              <input
                value={templateQuery}
                onChange={(e) => onTemplateQueryChange(e.target.value)}
                placeholder="Search templates"
              />
              <div className="grid gap-2 md:grid-cols-2">
                {templates.length === 0 && <div className="muted">No templates yet.</div>}
                {templates
                  .filter((t) => {
                    const q = templateQuery.trim().toLowerCase();
                    if (!q) return true;
                    return t.name.toLowerCase().includes(q) || t.content.toLowerCase().includes(q);
                  })
                  .map((t) => (
                    <div key={t.id} className="surface-soft p-3 grid gap-2">
                      <div className="row justify-between">
                        <div className="font-semibold truncate" title={t.name}>{t.name}</div>
                        {defaultPromptId === t.id && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] bg-mist-100 text-ink-900 dark:bg-ink-700 dark:text-white">Default</span>
                        )}
                      </div>
                      <div className="muted text-xs max-h-12 overflow-hidden">{t.content}</div>
                      <div className="row justify-between">
                        <Button variant="secondary" onClick={() => onSetDefault(t.id)}>
                          Apply
                        </Button>
                        <div className="row">
                          <IconButton aria-label="Edit template" title="Edit" onClick={() => onEditTemplate(t.id)}>
                            <Pencil size={14} />
                          </IconButton>
                          <IconButton aria-label="Delete template" title="Delete" onClick={() => onDeleteTemplate(t.id)}>
                            <Trash2 size={14} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="surface-soft p-3 grid gap-2">
              <div className="text-sm font-semibold">Edit template</div>
              {!editingTemplateId && <div className="muted">Select a template to edit.</div>}
              {editingTemplateId && (
                <>
                  <input
                    value={draftName}
                    onChange={(e) => onDraftNameChange(e.target.value)}
                    placeholder="Template name"
                  />
                  <textarea
                    rows={10}
                    value={draftContent}
                    onChange={(e) => onDraftContentChange(e.target.value)}
                    placeholder="Template content"
                  />
                  <div className="row justify-end">
                    <Button variant="secondary" onClick={onCancelEdit}>Cancel</Button>
                    <Button onClick={onSaveEdit}>Save</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
