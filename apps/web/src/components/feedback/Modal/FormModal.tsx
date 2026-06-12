import { memo, useEffect, useRef } from 'react';
import { Modal, Title } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/slices/uiSlice';
import { useGetFormSchemaQuery } from '@/store/api/schemaApi';
import { DynamicForm } from '@/components/forms/DynamicForm/DynamicForm';
import { trapFocus } from '@/lib/a11y/focus';
import type { RootState } from '@/store';
import type { RenderContext } from '@/core/actions/types';

const noop = () => {};

export const FormModal = memo(function FormModal() {
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.ui.modal);
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: formSchema } = useGetFormSchemaQuery(modal.schemaId!, {
    skip: !modal.open || !modal.schemaId,
  });

  useEffect(() => {
    if (modal.open && modalRef.current) return trapFocus(modalRef.current);
  }, [modal.open]);

  const context: RenderContext = { pagePath: '/', depth: 0 };

  return (
    <Modal
      opened={modal.open}
      onClose={() => dispatch(closeModal())}
      title={<Title order={5}>{modal.title ?? formSchema?.title ?? 'Form'}</Title>}
      size="md"
      radius="md"
      aria-modal
    >
      <div ref={modalRef}>
        {formSchema && (
          <DynamicForm id={formSchema.id} schema={formSchema} context={context} onAction={noop} />
        )}
      </div>
    </Modal>
  );
});
