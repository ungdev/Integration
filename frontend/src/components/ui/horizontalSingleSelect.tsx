import type { Dispatch, SetStateAction } from 'react';

type HorizontalSelectOption = {
    name: string;
    value: string;
};

type HorizontalSelectProps = {
    options: HorizontalSelectOption[];
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
};

function HorizontalSingleSelect(props: HorizontalSelectProps) {
    // if (!props.options || !props.value || !props.setValue) return null;

    return (
        <div className="relative flex w-full flex-col rounded-md bg-white shadow">
            <nav className="flex min-w-[240px] flex-row gap-1 p-2">
                {props.options.map((option) => (
                    <div
                        role="button"
                        className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                        key={option.value}>
                        <label
                            htmlFor={`radio-horizontal-list-${option.value}`}
                            className="flex w-full cursor-pointer items-center px-3 py-2">
                            <div className="inline-flex items-center">
                                <input
                                    name="framework-horizontal"
                                    type="radio"
                                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded-full shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                                    readOnly
                                    checked={props.value === option.value}
                                    onChange={() => props.setValue(option.value)}
                                    id={`radio-horizontal-list-${option.value}`}
                                />

                                <span className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
                            </div>

                            <span className="relative ml-2 text-slate-600 text-sm">{option.name}</span>
                        </label>
                    </div>
                ))}
            </nav>
        </div>
    );
}

export { HorizontalSingleSelect };
