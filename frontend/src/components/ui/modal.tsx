'use client';
import { type ReactNode, useEffect } from 'react';

import { Button } from '../ui/button';

/**
 * Displays a modal window.
 */
const Modal = ({
    title = '',
    children = '',
    buttons = '',
    visible = false,
    closable = true,
    closeOnOutsideClick = false,
    onCancel = () => {},
    onOk = () => {},
    className = '',
    containerClassName = '',
    modalButtonsClassName = '',
}: {
    /** Modal window title */
    title?: ReactNode;
    /** Modal window content */
    children?: ReactNode;
    /** Modal window buttons.
     * Pass `null` to hide the footer entirely.
     * Pass `""` (default) to get the default Annuler/Ok buttons. */
    buttons?: ReactNode | null;
    /** Whether the modal window is visible or not */
    visible: boolean;
    /** Whether the modal window is closable or not */
    closable?: boolean;
    /** Whether clicking outside the modal closes it */
    closeOnOutsideClick?: boolean;
    /** Function called when the user clicks on "Annuler" default button,
     * or on the close button, or presses Escape */
    onCancel: () => void;
    /** Function called when the user clicks on "Ok" default button */
    onOk?: () => void;
    /** An optional class name to add to the modal */
    className?: string;
    /** An optional class name to add to the modal container */
    containerClassName?: string;
    /** An optional class name to add to the modal buttons container */
    modalButtonsClassName?: string;
}) => {
    const buttonsContent =
        buttons === null ? null : buttons !== '' ? (
            buttons
        ) : (
            <>
                <Button onClick={onCancel}>Annuler</Button>
                <Button onClick={onOk}>Ok</Button>
            </>
        );

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        if (visible) {
            window.addEventListener('keydown', listener);
        }

        return () => {
            window.removeEventListener('keydown', listener);
        };
    }, [onCancel, visible]);

    return (
        <div
            aria-hidden={!visible}
            className={`fixed inset-0 z-50 transition-opacity duration-200 ${
                visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            } ${className}`}>
            <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-6">
                <button
                    aria-label="Close modal backdrop"
                    className="absolute inset-0 cursor-default bg-slate-950/60 backdrop-blur-[2px]"
                    disabled={!(closeOnOutsideClick && closable)}
                    onClick={
                        closeOnOutsideClick && closable
                            ? () => {
                                  onCancel();
                              }
                            : undefined
                    }
                    type="button"
                />

                <div
                    role="dialog"
                    aria-modal="true"
                    className={`relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-white text-foreground shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-neutral-900 dark:ring-white/10 ${containerClassName}`}>
                    <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5 dark:border-white/10">
                        <div className="text-lg font-semibold leading-tight">{title}</div>

                        {closable && (
                            <button
                                aria-label="Close modal"
                                className="relative -mr-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:bg-white/10"
                                onClick={onCancel}
                                type="button">
                                <span className="absolute h-4 w-0.5 rotate-45 rounded-full bg-current" />
                                <span className="absolute h-4 w-0.5 -rotate-45 rounded-full bg-current" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

                    {/* Render footer only if buttonsContent is not null */}
                    {buttonsContent && (
                        <div
                            className={`flex flex-wrap items-center justify-end gap-3 border-t border-border/60 px-6 py-5 dark:border-white/10 ${modalButtonsClassName}`}>
                            {buttonsContent}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
