"use client";

import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "~/components/ui/combobox";

const normalizeTerms = (terms: string[]) => {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const term of terms) {
    const trimmed = term.trim();
    const key = trimmed.toLowerCase();

    if (trimmed === "" || seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(trimmed);
  }

  return normalized;
};

const FreeTextMultiCombobox = ({
  value,
  onValueChange,
  placeholder = "Sök",
}: {
  value: string[];
  onValueChange: (terms: string[]) => void;
  placeholder?: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const anchorRef = useComboboxAnchor();
  const trimmedInput = inputValue.trim();
  const canAdd = useMemo(() => {
    const key = trimmedInput.toLowerCase();
    return key !== "" && !value.some((term) => term.toLowerCase() === key);
  }, [trimmedInput, value]);

  const updateTerms = (terms: string[]) => {
    const normalized = normalizeTerms(terms);
    onValueChange(normalized);

    if (normalized.length > value.length) {
      setInputValue("");
    }
  };

  const addInputValue = () => {
    if (!canAdd) {
      return false;
    }

    updateTerms([...value, trimmedInput]);
    return true;
  };

  return (
    <Combobox
      multiple
      value={value}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      onValueChange={updateTerms}
      filter={null}
      items={canAdd ? [trimmedInput] : []}
    >
      <ComboboxChips ref={anchorRef} className="max-w-full min-w-64">
        {value.map((term) => (
          <ComboboxChip key={term}>{term}</ComboboxChip>
        ))}
        <ComboboxChipsInput
          placeholder={value.length === 0 ? placeholder : undefined}
          onKeyDown={(event) => {
            if (
              event.key !== "Enter" &&
              event.key !== "Tab" &&
              event.key !== ","
            ) {
              return;
            }

            if (addInputValue()) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        />
      </ComboboxChips>
      {canAdd && (
        <ComboboxContent anchor={anchorRef}>
          <ComboboxList>
            <ComboboxItem value={trimmedInput}>
              Lägg till &quot;{trimmedInput}&quot;
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
};

export default FreeTextMultiCombobox;
