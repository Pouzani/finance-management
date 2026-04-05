import { useEffect, type Dispatch, type SetStateAction } from 'react';

export function useActionMenuOutsideClick(
  isOpen: boolean,
  setMenuOpenId: Dispatch<SetStateAction<string | null>>,
) {
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (!(e.target as Element).closest('[data-action-menu]')) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, setMenuOpenId]);
}
