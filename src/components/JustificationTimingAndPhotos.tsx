import React from 'react';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import CroppedPicture from '../classes/CroppedPicture';
import { JustificationInput } from '../types/types';

interface JustificationTimingAndPhotosProps {
    justificationQuantity: number;
    justificationReason: string;
    justifications: JustificationInput[];
    onUpdateJustification: (index: number, field: keyof JustificationInput, value: any) => void;
    onPhotoUpload: (justificationIndex: number, photoIndex: number, photo: CroppedPicture) => void;
    onTimingChange: (justificationIndex: number, timingIndex: number, timing: Dayjs | null) => void;
}

const JustificationTimingAndPhotos: React.FC<JustificationTimingAndPhotosProps> = ({
    justificationQuantity,
    justificationReason,
    justifications,
    onPhotoUpload,
    onTimingChange,
}) => {

    // Generate justification entries based on quantity
    const generateJustifications = () => {
        const entries: JustificationInput[] = [];

        for (let i = 0; i < justificationQuantity; i++) {
            // Check if we already have this justification or create new one
            const existingJustification = justifications.find(j => j.index === i);

            entries.push(existingJustification || {
                id: `${justificationReason.toLowerCase().replace(/\s+/g, '-')}-${i}`,
                reason: justificationReason,
                index: i,
                timings: [null, null], // 2 timing inputs per justification
                photos: [undefined, undefined], // 2 photo inputs per justification
                remarks: '',
            });
        }

        return entries;
    };

    const justificationEntries = generateJustifications();

    const handlePhotoChange = (justificationIndex: number, photoIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create CroppedPicture instance with the uploaded file
            const croppedPicture = new CroppedPicture(file);
            onPhotoUpload(justificationIndex, photoIndex, croppedPicture);
        }
    };

    return (
        <div className="justification-timing-photos">
            <h3 className="text-lg font-semibold mb-4">
                {justificationReason} Justifications ({justificationQuantity})
            </h3>

            {justificationEntries.map((justification, justificationIndex) => (
                <div key={justification.id} className="mb-6 p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">
                        {justificationReason} #{justificationIndex + 1}
                    </h4>

                    {/* Timing Inputs - 2 per justification */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timing Inputs
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[0, 1].map((timingIndex) => (
                                <div key={timingIndex}>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Timing {timingIndex + 1}
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={justification.timings?.[timingIndex]?.format('YYYY-MM-DDTHH:mm') || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const dayjsValue = value ? dayjs(value) : null;
                                            onTimingChange(justificationIndex, timingIndex, dayjsValue);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Photo Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[0, 1].map((photoIndex) => (
                            <div key={photoIndex}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Photo {photoIndex + 1}
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePhotoChange(justificationIndex, photoIndex, e)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />

                                {/* Photo Preview */}
                                {justification.photos[photoIndex] && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(justification.photos[photoIndex]!.croppedBlob || new Blob())}
                                            alt={`${justificationReason} ${justificationIndex + 1} - Photo ${photoIndex + 1}`}
                                            className="w-full h-32 object-cover rounded border"
                                            onError={(e) => {
                                                // Fallback to base64 if blob URL fails
                                                justification.photos[photoIndex]?.getBase64().then(base64 => {
                                                    (e.target as HTMLImageElement).src = base64;
                                                });
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JustificationTimingAndPhotos;
