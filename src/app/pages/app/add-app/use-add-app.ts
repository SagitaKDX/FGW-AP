import { useFapDataCustom } from '@/app/providers/fap-data-provider';

export const useAddApp = () => {
  return useFapDataCustom({
    formHtml: (original: Element | undefined) => {
      // Find the form content div
      const contentDiv = original?.querySelector('#ctl00_mainContent_divContent') as HTMLElement | null;
      if (!contentDiv) return '';

      return enhanceFormHtml(contentDiv);
    },
    viewStateValue: (original: Element | undefined) => {
      const viewState = original?.querySelector('#__VIEWSTATE') as HTMLInputElement | null;
      return viewState ? viewState.value : '';
    },
    viewStateGeneratorValue: (original: Element | undefined) => {
      const viewStateGenerator = original?.querySelector('#__VIEWSTATEGENERATOR') as HTMLInputElement | null;
      return viewStateGenerator ? viewStateGenerator.value : '';
    },
    eventValidationValue: (original: Element | undefined) => {
      const eventValidation = original?.querySelector('#__EVENTVALIDATION') as HTMLInputElement | null;
      return eventValidation ? eventValidation.value : '';
    },
  });
};

// Helper function to enhance the form HTML for better display
const enhanceFormHtml = (contentDiv: HTMLElement): string => {
  // Clone the content div to avoid modifying the original
  const clone = contentDiv.cloneNode(true) as HTMLElement;

  // Find the table with form fields
  const table = clone.querySelector('table.table-bordered') as HTMLElement | null;
  if (!table) return clone.innerHTML;

  // Apply styling to the table
  table.classList.add('w-full', 'border-collapse');
  
  // Style table rows
  const rows = table.querySelectorAll('tr') as NodeListOf<HTMLElement>;
  rows.forEach((row) => {
    row.classList.add('border-b', 'border-gray-200');
    
    // Style table cells
    const cells = row.querySelectorAll('td') as NodeListOf<HTMLElement>;
    cells.forEach((cell, index) => {
      if (index === 0) {
        // First column (labels)
        cell.classList.add('py-3', 'px-4', 'font-medium', 'text-foreground', 'w-1/4');
      } else {
        // Second column (inputs)
        cell.classList.add('py-3', 'px-4');
      }
    });
  });

  // Style form controls
  const selects = clone.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;
  selects.forEach((select) => {
    select.classList.add(
      'w-full',
      'px-3',
      'py-2',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'text-sm',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary',
      'focus:border-primary',
      'transition-colors',
      'bg-background'
    );
  });

  const textareas = clone.querySelectorAll('textarea') as NodeListOf<HTMLTextAreaElement>;
  textareas.forEach((textarea) => {
    textarea.classList.add(
      'w-full',
      'px-3',
      'py-2',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'text-sm',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary',
      'focus:border-primary',
      'transition-colors',
      'bg-background',
      'resize-y',
      'min-h-[100px]'
    );
  });

  const inputs = clone.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;
  inputs.forEach((input) => {
    input.classList.add(
      'w-full',
      'px-3',
      'py-2',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'text-sm',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary',
      'focus:border-primary',
      'transition-colors',
      'bg-background'
    );
  });

  const fileInputs = clone.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
  fileInputs.forEach((input) => {
    input.classList.add(
      'w-full',
      'px-3',
      'py-2',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'text-sm',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary',
      'focus:border-primary',
      'transition-colors',
      'bg-background',
      'file:mr-4',
      'file:py-2',
      'file:px-4',
      'file:rounded-md',
      'file:border-0',
      'file:text-sm',
      'file:font-semibold',
      'file:bg-primary/10',
      'file:text-primary',
      'hover:file:bg-primary/20'
    );
  });

  // Style submit button
  const submitButton = clone.querySelector('input[type="submit"]') as HTMLInputElement | null;
  if (submitButton) {
    submitButton.classList.add(
      'px-6',
      'py-2',
      'bg-primary',
      'text-white',
      'rounded-md',
      'font-medium',
      'shadow-sm',
      'hover:bg-primary-active',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-primary',
      'transition-colors',
      'cursor-pointer'
    );
  }

  // Style labels and error messages
  const labels = clone.querySelectorAll('span[id*="lbl"]') as NodeListOf<HTMLElement>;
  labels.forEach((label) => {
    if (label.id.includes('Error')) {
      label.classList.add('text-sm', 'text-red-500', 'font-medium', 'block', 'mt-2');
    } else if (label.id.includes('Fee')) {
      label.classList.add('text-sm', 'font-bold', 'text-red-600', 'block', 'mt-2');
    } else {
      label.classList.add('text-sm', 'text-foreground');
    }
  });

  // Style links
  const links = clone.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
  links.forEach((link) => {
    link.classList.add('text-primary', 'hover:text-primary-active', 'underline');
  });

  // Style the quantity input container
  const quantityDiv = clone.querySelector('#ctl00_mainContent_divH') as HTMLElement | null;
  if (quantityDiv) {
    const input = quantityDiv.querySelector('input') as HTMLInputElement | null;
    if (input) {
      input.classList.add('max-w-[150px]');
    }
  }

  return clone.innerHTML;
};

