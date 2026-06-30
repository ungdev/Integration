import type { Dispatch, SetStateAction } from 'react';

type HorizontalSelectOption = {
    name: string;
    value: string;
};

type HorizontalSelectProps = {
    options: HorizontalSelectOption[];
    value: string[];
    setValue: Dispatch<SetStateAction<string[]>>;
};

function HorizontalMultipleSelect(props: HorizontalSelectProps) {
    if (!props.options || !props.value || !props.setValue) return null;

    const toggleCheckbox = (newValue: string) => {
        props.setValue((prev) => {
            const current = prev ?? [];

            return current.includes(newValue) ? current.filter((g) => g !== newValue) : [...current, newValue];
        });
    };

    return (
        <div className="relative flex w-full flex-col rounded-md bg-white shadow">
            <nav className="flex min-w-[240px] flex-row gap-1 p-2">
                {props.options.map((option) => (
                    <div
                        role="button"
                        className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                        key={option.value}>
                        <label
                            htmlFor={`check-horizontal-list-${option.value}`}
                            className="flex w-full cursor-pointer items-center px-3 py-2">
                            <div className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    id={`check-horizontal-list-${option.value}`}
                                    checked={props.value?.includes(option.value) ?? false}
                                    onChange={() => toggleCheckbox(option.value)}
                                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                                />

                                <span className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        />
                                    </svg>
                                </span>
                            </div>

                            <span className="ml-2 text-sm text-slate-600">{option.name}</span>
                        </label>
                    </div>
                ))}
            </nav>
        </div>
    );
}

export { HorizontalMultipleSelect };
