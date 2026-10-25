/** Text content of every body row of the tables inside `root`, one array of cells per row. */
export function tableRows(root: HTMLElement): string[][] {
  return Array.from(root.querySelectorAll('tbody tr')).map((row) =>
    Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() ?? ''),
  );
}

/** Text content of the table headers inside `root`. */
export function tableHeaders(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('thead th')).map(
    (cell) => cell.firstChild?.textContent?.trim() ?? '',
  );
}

export function typeInto(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

export function selectOption(select: HTMLSelectElement, value: string): void {
  select.value = value;
  select.dispatchEvent(new Event('change'));
}
