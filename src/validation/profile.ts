import { create } from 'zustand';

export interface ProfileFormData {
    name: string;
    bio?: string;
    gender?: string;
    bornYear?: string;
    avatarUrl: string;
}

interface ValidationError {
    name?: string;
}

interface ProfileValidationStore {
    errors: ValidationError;
    validateProfile: (data: ProfileFormData) => boolean;
    clearErrors: () => void;
}

export const useProfileValidation = create<ProfileValidationStore>((set) => ({
    errors: {},
    validateProfile: (data) => {
        const errors: ValidationError = {};

        // Name is required and must be at least 2 characters
        if (!data.name || data.name.trim().length < 2) {
            errors.name = 'Name is required and must be at least 2 characters';
        }

        set({ errors });
        return Object.keys(errors).length === 0;
    },
    clearErrors: () => set({ errors: {} }),
}));
