import { reactive } from 'vue';

export const useModalState = <TContext = unknown>() => {
    const state = reactive<{ context: TContext | null; isOpened: boolean }>({
        context: null,
        isOpened: false,
    });

    const open = (context: TContext | null = null) => {
        state.context = context;
        state.isOpened = true;
    };

    const close = () => {
        state.context = null;
        state.isOpened = false;
    };

    return {
        modalState: state,
        modalActions: {
            open,
            close
        },
        modalExpose: {
            open
        },
    };
};
