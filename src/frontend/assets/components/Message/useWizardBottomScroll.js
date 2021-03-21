import { useEffect } from 'react';

// this assume the .scroll_to_wizard_bottom
// would rather scroll to own element's scroll to ref...
// but that doesn't play nice with iOS action bar
export function useWizardBottomScroll(scrollToWizardBottom) {
  useEffect(() => {
    if (scrollToWizardBottom) {
      const wizardBottomElement = document.querySelector('.scroll_to_wizard_bottom');
      wizardBottomElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [scrollToWizardBottom]);
}

export default useWizardBottomScroll;
