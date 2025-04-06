
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatRelativeTime, useSocialMedia } from '@/hooks/useSocialMedia';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const SocialMediaFeed: React.FC = () => {
  const { data: posts = [], isLoading } = useSocialMedia(['twitter', 'instagram', 'facebook']);

  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4 pb-2 flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-40 w-full mt-3 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No social media posts to display</p>
        </CardContent>
      </Card>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-500">
            <path
              fill="currentColor"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            ></path>
          </svg>
        );
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-600">
            <path
              fill="currentColor"
              d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85,0,3.2,0,3.58-.07,4.85-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07-3.2,0-3.58,0-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85,0-3.2,0-3.58.07-4.85C2.33,3.92,3.84,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-7,7C0,8.33,0,8.74,0,12S0,15.67.07,17c.2,4.36,2.62,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.35-.2,6.78-2.62,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.43,1.44A1.44,1.44,0,0,0,18.41,4.15Z"
            ></path>
          </svg>
        );
      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600">
            <path
              fill="currentColor"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            ></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="space-y-4 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.slice(0, 4).map((post) => (
        <motion.div key={post.id} variants={itemVariants}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
            <CardHeader className="p-4 pb-2 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {post.profileImage ? (
                  <img src={post.profileImage} alt={post.username} className="w-full h-full object-cover" />
                ) : (
                  getPlatformIcon(post.platform)
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{post.username}</p>
                  {getPlatformIcon(post.platform)}
                </div>
                <p className="text-xs text-gray-500">{formatRelativeTime(post.date)}</p>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm mb-3 whitespace-pre-line">{post.content}</p>
              
              {post.mediaUrl && (
                <div className="rounded-md overflow-hidden mt-2 mb-3">
                  <img src={post.mediaUrl} alt="" className="w-full h-auto" />
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div className="space-x-3 flex">
                  <span className="flex items-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1 fill-current">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {post.likes}
                  </span>
                  <span className="flex items-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1 fill-current">
                      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                    {post.comments}
                  </span>
                  {post.shares && (
                    <span className="flex items-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1 fill-current">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                      </svg>
                      {post.shares}
                    </span>
                  )}
                </div>
                
                {post.url && (
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-team-blue hover:underline"
                  >
                    View Original
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SocialMediaFeed;
