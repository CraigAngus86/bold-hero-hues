
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import { useImageUpload } from '@/services/images';
import { BucketType } from '@/services/images/types';

interface PlayerImageUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  playerName?: string;
  initialImageUrl?: string;
}

const PlayerImageUploader: React.FC<PlayerImageUploaderProps> = ({ 
  currentUrl,
  onUpload,
  playerName,
  initialImageUrl
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const displayUrl = currentUrl || initialImageUrl;

  const { 
    uploadFile, 
    isUploading, 
    progress 
  } = useImageUpload({
    bucket: BucketType.PLAYERS,
    folderPath: 'players'
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, {
        alt_text: `${playerName || 'Player'} photo`
      });
      
      if (result.success && result.data && result.data.url) {
        onUpload(result.data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleRemove = () => {
    onUpload('');
  };

  return (
    <div>
      {displayUrl ? (
        <div 
          className="relative rounded-md overflow-hidden" 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src={displayUrl} 
            alt={playerName || "Player"} 
            className="w-full h-48 object-cover rounded-md" 
          />
          {isHovering && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRemove}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="mb-4">
              <UploadCloud className="h-10 w-10 text-gray-400" />
            </div>
            <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">PNG, JPG (max. 2MB)</p>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                disabled={isUploading}
                onClick={() => document.getElementById('player-image-upload')?.click()}
              >
                {isUploading ? `Uploading... ${progress}%` : 'Select File'}
              </Button>
              <input 
                id="player-image-upload"
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerImageUploader;
