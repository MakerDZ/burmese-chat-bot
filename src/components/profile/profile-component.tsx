'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTelegram } from '@/providers/TelegramProvider';
import { useMutation } from 'convex/react';
import {
    useProfileValidation,
    type ProfileFormData,
} from '@/validation/profile';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';

const AVATAR_OPTIONS = [
    'https://i.pinimg.com/736x/00/9f/c0/009fc09a302e18d5cb0c1ecc75d728e5.jpg',
    'https://i.pinimg.com/736x/c1/35/ee/c135ee117c8224dbbcb6e8b1b030e4d4.jpg',
    'https://i.pinimg.com/736x/00/75/0f/00750f89dbf6ee5cf715611752295701.jpg',
    'https://i.pinimg.com/736x/5f/b3/20/5fb320adf4f0dff66a98b9019fcb61c1.jpg',
    'https://i.pinimg.com/736x/f6/10/20/f6102023124c2da37de8fb7d154ef178.jpg',
    'https://i.pinimg.com/1200x/bd/d9/f7/bdd9f78c69f6cf95f004e3b57abf58cc.jpg',
    'https://i.pinimg.com/1200x/0d/df/f6/0ddff63317d77a5c8d22f684f78398a3.jpg',
    'https://i.pinimg.com/1200x/cc/c4/d7/ccc4d702c07bbf5cb409bb49a23b2535.jpg',
    'https://i.pinimg.com/736x/da/2d/f6/da2df612c785b2cf2ee1437eb43516d7.jpg',
    'https://i.pinimg.com/736x/9d/3c/79/9d3c7924322caa0f0e582b1d6a485169.jpg',
    'https://i.pinimg.com/736x/8c/77/e7/8c77e78c19b53672d393d3da338f5d8b.jpg',
];

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

const YEAR_RANGE = Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
);

export function ProfileComponent({ profile }: { profile: any }) {
    // const updateProfile = useMutation(api.profile.updateProfile);
    const { theme } = useTelegram();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        name: profile?.name,
        bio: profile?.bio || '',
        gender: profile?.gender || undefined,
        bornYear: profile?.bornYear?.toString() || '',
        avatarUrl: profile?.avatarUrl,
    });

    const { errors, validateProfile, clearErrors } = useProfileValidation();
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    // Mount effect
    useEffect(() => {
        setMounted(true);
    }, []);

    // Background color effect
    useEffect(() => {
        if (theme?.bg_color) {
            document.body.style.backgroundColor = theme.bg_color;
        }
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [theme?.bg_color]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        try {
            if (validateProfile(formData)) {
                setIsSubmitting(true);
                // await updateProfile({
                //     profile: {
                //         name: formData.name,
                //         bio: formData.bio ?? '',
                //         gender:
                //             formData.gender === ''
                //                 ? undefined
                //                 : (formData.gender as 'male' | 'female'),
                //         bornYear: formData.bornYear
                //             ? parseInt(formData.bornYear)
                //             : undefined,
                //         avatarUrl: formData.avatarUrl,
                //     },
                // });
                toast.success('Profile updated successfully');
            } else {
                toast.error('Validation failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Detect dark/light theme
    const isDarkTheme =
        theme?.bg_color?.toLowerCase().startsWith('#1') ||
        theme?.bg_color?.toLowerCase().startsWith('#2') ||
        theme?.bg_color?.toLowerCase().startsWith('#0');

    if (!mounted) {
        return (
            <div className="min-h-screen w-11/12 sm:max-w-md mx-auto p-4">
                <div className="animate-pulse space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-gray-200" />
                        <div className="h-10 bg-gray-200 rounded w-[200px]" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-24 bg-gray-200 rounded w-full" />
                    </div>
                </div>
            </div>
        );
    }

    const buttonStyle = {
        backgroundColor: isDarkTheme ? '#FFFFFF' : '#000000',
        color: isDarkTheme ? '#000000' : '#FFFFFF',
        border: `1px solid ${isDarkTheme ? '#FFFFFF' : '#000000'}`,
    };

    const buttonOutlineStyle = {
        backgroundColor: isDarkTheme ? '#1F1F1F' : '#FFFFFF',
        color: isDarkTheme ? '#FFFFFF' : '#000000',
        border: `1px solid ${isDarkTheme ? '#FFFFFF' : '#000000'}`,
    };

    return (
        <div
            className="min-h-screen w-11/12 sm:max-w-md mx-auto p-4"
            style={{
                color: theme?.text_color,
            }}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                        <img
                            src={formData.avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full max-w-[200px]"
                        onClick={() => setShowAvatarModal(true)}
                        style={buttonOutlineStyle}
                    >
                        Change Picture
                    </Button>
                </div>

                {/* Avatar Selection Modal */}
                {showAvatarModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div
                            className="rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            style={{
                                backgroundColor: theme?.bg_color,
                                color: theme?.text_color,
                            }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3
                                    className="text-lg font-semibold"
                                    style={{ color: theme?.text_color }}
                                >
                                    Choose Profile Picture
                                </h3>
                                <button
                                    onClick={() => setShowAvatarModal(false)}
                                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                                    style={{ color: theme?.text_color }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {AVATAR_OPTIONS.map((avatar, index) => (
                                    <button
                                        key={index}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                                            formData.avatarUrl === avatar
                                                ? 'border-primary'
                                                : 'border-transparent'
                                        }`}
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                avatarUrl: avatar,
                                            });
                                            setShowAvatarModal(false);
                                        }}
                                    >
                                        <img
                                            src={avatar}
                                            alt={`Avatar option ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Name */}
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        style={{ color: theme?.text_color }}
                    >
                        Name
                    </label>
                    <div>
                        <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Enter your name"
                            className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                            style={{
                                backgroundColor: isDarkTheme
                                    ? 'rgba(255,255,255,0.1)'
                                    : theme?.bg_color,
                                color: theme?.text_color,
                                borderColor: errors.name
                                    ? undefined
                                    : theme?.hint_color,
                            }}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        style={{ color: theme?.text_color }}
                    >
                        Bio
                    </label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Write something about yourself"
                        className="flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                            backgroundColor: isDarkTheme
                                ? 'rgba(255,255,255,0.1)'
                                : theme?.bg_color,
                            color: theme?.text_color,
                            borderColor: theme?.hint_color,
                        }}
                    />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        style={{ color: theme?.text_color }}
                    >
                        Gender
                    </label>
                    <select
                        value={formData.gender}
                        onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                        }
                        className="w-full rounded-md border px-3 py-2"
                        style={{
                            backgroundColor: isDarkTheme
                                ? 'rgba(255,255,255,0.1)'
                                : theme?.bg_color,
                            color: theme?.text_color,
                            borderColor: theme?.hint_color,
                        }}
                    >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Born Year */}
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        style={{ color: theme?.text_color }}
                    >
                        Born Year
                    </label>
                    <select
                        value={formData.bornYear}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                bornYear: e.target.value,
                            })
                        }
                        className="w-full rounded-md border px-3 py-2"
                        style={{
                            backgroundColor: isDarkTheme
                                ? 'rgba(255,255,255,0.1)'
                                : theme?.bg_color,
                            color: theme?.text_color,
                            borderColor: theme?.hint_color,
                        }}
                    >
                        <option value="">Select year</option>
                        {YEAR_RANGE.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    style={buttonStyle}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
            </form>
        </div>
    );
}
