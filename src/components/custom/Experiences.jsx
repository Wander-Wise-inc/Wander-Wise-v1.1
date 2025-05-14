// src/components/custom/Experiences.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MapPin, Share2, MessageSquare, Image as ImageIcon, Send, Loader2, AlertTriangle, User, Calendar, Edit, ThumbsUp, MessageCircle as CommentIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { auth } from '../../service/firebaseConfig';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// More diverse sample data for experiences
const initialTourSpots = [
  {
    id: '1',
    user: 'Aisha Khan',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=80&q=60',
    location: 'Taj Mahal, Agra',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200&h=800',
    likes: 1256,
    description: "Sunrise at the Taj Mahal was an ethereal experience. The way the light dances on the marble is something you have to see to believe. Truly a monument of love. Arrive early to beat the crowds!",
    comments: [
      { id: 'c1', user: 'Rohan S.', text: 'Incredible shot! Was it crowded when you went?', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&q=60' },
      { id: 'c2', user: 'Priya M.', text: 'Added to my bucket list! Any tips for visiting?', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&q=60' },
    ],
    timestamp: '2 days ago',
    tags: ['Iconic', 'History', 'Sunrise', 'UNESCO', 'Agra']
  },
  {
    id: '2',
    user: 'Vikram Patel',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=80&q=60',
    location: 'Spiti Valley, Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1605648339500-639009751855?auto=format&fit=crop&q=80&w=1200&h=800',
    likes: 980,
    description: "The raw, rugged beauty of Spiti Valley is humbling. Trekked to Key Monastery and the views were out of this world. Challenging but so rewarding! Prepare for high altitudes.",
    comments: [
      { id: 'c3', user: 'AdventureAlia', text: 'Wow, that landscape! How was the altitude sickness?', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&q=60'}
    ],
    timestamp: '1 week ago',
    tags: ['Adventure', 'Mountains', 'Trekking', 'Spiritual', 'Himachal']
  },
  // ... (add more initialTourSpots as needed)
];

const TravelPostCard = ({ post, onLike, onComment, currentUserId }) => {
  const [liked, setLiked] = useState(post.likedBy?.includes(currentUserId) || false);
  const [currentLikes, setCurrentLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    setLiked(post.likedBy?.includes(currentUserId) || false);
    setCurrentLikes(post.likes);
  }, [post.likedBy, post.likes, currentUserId]);

  const handleLike = () => {
    if (!currentUserId) { alert("Please sign in to like posts."); return; }
    const newLikeStatus = !liked;
    setLiked(newLikeStatus);
    setCurrentLikes(prevLikes => newLikeStatus ? prevLikes + 1 : prevLikes - 1);
    onLike(post.id, newLikeStatus);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) { alert("Please sign in to comment."); return; }
    if (!newComment.trim()) return;
    setIsCommenting(true);
    try {
      await onComment(post.id, newComment);
      setNewComment('');
    } catch (error) { console.error("Failed to submit comment:", error); } 
    finally { setIsCommenting(false); }
  };

  return (
    <Card variant="default" className="mb-8 shadow-xl overflow-hidden group/post bg-card/95 backdrop-blur-sm border-card-border/70">
      <CardHeader className="p-4 md:p-5 flex items-center space-x-3.5 border-b border-card-border/50">
        <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-primary/30 shadow-sm"> {/* Bigger Avatar */}
          <AvatarImage src={post.userAvatar || `https://ui-avatars.com/api/?name=${post.user}&background=random&color=fff&size=64`} alt={post.user} />
          <AvatarFallback className="text-lg">{post.user ? post.user.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-primary font-sans text-base md:text-lg group-hover/post:text-accent transition-colors">{post.user}</p>
          <div className="text-xs text-muted-foreground flex items-center space-x-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5" /> <span>{post.location}</span>
            <span className="text-muted-foreground/50">&bull;</span>
            <Calendar className="w-3.5 h-3.5" /> <span>{post.timestamp}</span>
          </div>
        </div>
      </CardHeader>
      
      {post.image && (
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={post.image} 
            alt={`Experience at ${post.location} by ${post.user}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover/post:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/1200x675/E0C8B0/493628?text=Image+Not+Available&font=lato`; }}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/post:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      <CardContent className="p-4 md:p-5">
        <p className="text-foreground/90 text-sm mb-4 font-sans leading-relaxed line-clamp-5 md:line-clamp-none">{post.description}</p>
        {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full font-medium cursor-pointer hover:bg-secondary-hover transition-colors">
                        #{tag}
                    </span>
                ))}
            </div>
        )}
        <div className="flex justify-between items-center text-muted-foreground pt-2 border-t border-card-border/30">
          <div className="flex space-x-2 sm:space-x-3">
            <Button variant="ghost" size="sm" onClick={handleLike} className={`flex items-center space-x-1.5 group/action ${liked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}>
              <Heart className={`w-5 h-5 transition-all group-hover/action:scale-110 ${liked ? 'fill-red-500' : 'group-hover/action:fill-red-500/20'}`} />
              <span className="text-sm font-medium">{currentLikes}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1.5 hover:text-primary group/action">
              <CommentIcon className="w-5 h-5 group-hover/action:scale-110" />
              <span className="text-sm font-medium">{post.comments.length}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="hover:text-primary group/action">
            <Share2 className="w-5 h-5 group-hover/action:scale-110" />
          </Button>
        </div>
      </CardContent>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="border-t border-card-border/50 bg-muted/10 px-4 py-4 md:px-5"
          >
            <h4 className="text-sm font-semibold text-foreground mb-3">Comments ({post.comments.length})</h4>
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {post.comments.length > 0 ? post.comments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-2.5 text-xs">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatar || `https://ui-avatars.com/api/?name=${comment.user.substring(0,2)}&size=32&background=random`} alt={comment.user} />
                    <AvatarFallback className="text-xs">{comment.user ? comment.user.substring(0,1).toUpperCase() : 'A'}</AvatarFallback>
                  </Avatar>
                  <div className="bg-background p-2.5 rounded-lg shadow-sm flex-1 border border-border/50">
                    <span className="font-semibold text-primary text-xs">{comment.user}: </span>
                    <span className="text-foreground/80 leading-snug">{comment.text}</span>
                  </div>
                </div>
              )) : <p className="text-xs text-muted-foreground italic py-2">No comments yet. Be the first to share your thoughts!</p>}
            </div>
            {currentUserId && (
              <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center space-x-2">
                <Textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a thoughtful comment..." 
                  className="flex-grow p-2.5 text-sm border-input rounded-lg focus:ring-2 focus:ring-accent min-h-[44px] resize-none"
                  rows={1}
                />
                <Button type="submit" size="icon" variant="primary" disabled={!newComment.trim() || isCommenting} className="shrink-0 h-11 w-11">
                  {isCommenting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                </Button>
              </form>
            )}
            {!currentUserId && <p className="text-xs text-muted-foreground mt-3">Please <Button variant="link" size="sm" className="p-0 h-auto text-accent" onClick={() => alert("Redirect to login/signup")}>sign in</Button> to comment.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
// ... (rest of Experiences component from previous batch, ensure it uses TravelPostCard)
const Experiences = () => {
  const [posts, setPosts] = useState(initialTourSpots);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For future API calls
  const [error, setError] = useState(null);
  const [newPostText, setNewPostText] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [newPostImageFile, setNewPostImageFile] = useState(null); // For image upload
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user));
    // TODO: Fetch posts from a backend service
    return () => unsubscribe();
  }, []);

  const handleLikePost = useCallback((postId, isLiked) => {
    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === postId ? { ...p, likes: p.likes + (isLiked ? 1 : -1), likedBy: isLiked ? [...(p.likedBy || []), currentUser?.uid] : (p.likedBy || []).filter(uid => uid !== currentUser?.uid) } : p
      )
    );
  }, [currentUser?.uid]);

  const handleCommentOnPost = useCallback(async (postId, commentText) => {
    if (!currentUser) return;
    const newComment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user: currentUser.displayName || "Wanderer",
      avatar: currentUser.photoURL,
      text: commentText,
    };
    return new Promise(resolve => {
        setTimeout(() => {
            setPosts(prevPosts => 
              prevPosts.map(p => 
                p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p // Add new comment to the top
              )
            );
            resolve();
        }, 300);
    });
  }, [currentUser]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert("Please sign in to share your experience."); return; }
    if (!newPostText.trim() || !newPostLocation.trim()) { alert("Please add a description and location for your experience."); return; }
    
    setIsSubmittingPost(true);
    // Simulate image upload if a file is selected
    let uploadedImageUrl = '';
    if (newPostImageFile) {
        // In a real app, upload newPostImageFile to Firebase Storage or other service
        // For now, just use a placeholder or the file name as a mock URL
        await new Promise(res => setTimeout(res, 500)); // Simulate upload delay
        uploadedImageUrl = URL.createObjectURL(newPostImageFile); // Temporary local URL for display
        console.log("Simulated image upload, URL:", uploadedImageUrl);
    }

    const newPost = {
        id: `post_${Date.now()}`,
        user: currentUser.displayName || "Anonymous Wanderer",
        userAvatar: currentUser.photoURL,
        location: newPostLocation,
        image: uploadedImageUrl || `https://placehold.co/1200x800/secondary/foreground?text=Shared+Moment&font=playfairdisplay`,
        likes: 0,
        likedBy: [],
        description: newPostText,
        comments: [],
        timestamp: 'Just now',
        tags: newPostLocation.split(/,|\s+/).map(tag => tag.trim()).filter(Boolean).slice(0,3), // Basic tag generation
    };

    await new Promise(res => setTimeout(res, 700)); 
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostText("");
    setNewPostLocation("");
    setNewPostImageFile(null);
    if (document.getElementById('postImageUpload')) { // Reset file input
        (document.getElementById('postImageUpload')).value = "";
    }
    setIsSubmittingPost(false);
  };

  const handleImageFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        setNewPostImageFile(event.target.files[0]);
    }
  };


  const pageVariants = {
    initial: { opacity: 0, filter: "blur(5px)" },
    in: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
    out: { opacity: 0, filter: "blur(5px)", transition: { duration: 0.3, ease: "easeIn" } }
  };

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale:0.95 },
    visible: { opacity: 1, y: 0, scale:1, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background py-10 md:py-16"
    >
      <div className="container mx-auto px-4 max-w-2xl lg:max-w-3xl"> {/* Wider on large screens */}
        <motion.div 
            variants={itemVariants} 
            initial="hidden" 
            animate="visible" 
            className="text-center mb-10 md:mb-14 pb-6 border-b border-border"
        >
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-primary mb-3">
            Shared <span className="text-accent">Journeys</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Discover inspiring travel stories, tips, and hidden gems from fellow wanderers across India.
          </p>
        </motion.div>

        {currentUser && (
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-10">
                <Card className="shadow-xl border-primary/20 bg-card/90 backdrop-blur-sm" variant="default">
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl text-primary flex items-center">
                            <Edit className="w-5 h-5 mr-2.5 text-accent"/> Share Your Latest Adventure
                        </CardTitle>
                        <CardDescription>Inspire others with your travel tales and photos!</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleCreatePost}>
                        <CardContent className="space-y-4">
                            <Textarea 
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                placeholder={`What made your trip to ${newPostLocation || 'your destination'} special, ${currentUser.displayName}? Share details...`}
                                className="min-h-[120px] text-sm focus:ring-accent focus:border-accent"
                                rows={5}
                            />
                            <input 
                                type="text"
                                value={newPostLocation}
                                onChange={(e) => setNewPostLocation(e.target.value)}
                                placeholder="Location (e.g., Manali, Himachal Pradesh)"
                                className="w-full p-3 border border-input rounded-lg text-sm focus:ring-1 focus:ring-accent focus:border-accent"
                            />
                             <div className="flex items-center space-x-3">
                                <label htmlFor="postImageUpload" className={cn(buttonVariants({variant: "outline", size: "sm"}), "cursor-pointer text-sm")}>
                                    <ImageIcon className="w-4 h-4 mr-2"/> Add Photo
                                </label>
                                <input type="file" id="postImageUpload" accept="image/*" onChange={handleImageFileChange} className="hidden"/>
                                {newPostImageFile && <span className="text-xs text-muted-foreground">{newPostImageFile.name} (selected)</span>}
                                {!newPostImageFile && <span className="text-xs text-muted-foreground">(Optional)</span>}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" variant="accent" className="w-full sm:w-auto shadow-interactive" disabled={isSubmittingPost}>
                                {isSubmittingPost ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Send className="w-5 h-5 mr-2"/>}
                                Share Experience
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        )}

        {isLoading && <div className="flex justify-center py-10"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}
        {error && !isLoading && <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm flex items-center justify-center"><AlertTriangle className="w-5 h-5 mr-2"/> {error}</div>}
        
        {!isLoading && !error && (
          <motion.div variants={listContainerVariants} initial="hidden" animate="visible">
            {posts.length > 0 ? posts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <TravelPostCard post={post} onLike={handleLikePost} onComment={handleCommentOnPost} currentUserId={currentUser?.uid} />
              </motion.div>
            )) : (
                 <motion.div variants={itemVariants} className="text-center py-16 text-muted-foreground">
                    <ImageIcon className="w-24 h-24 mx-auto mb-6 opacity-40"/>
                    <p className="text-xl font-semibold font-serif">No Experiences Shared Yet</p>
                    <p className="mt-2">Be the first to share your amazing travel stories and inspire others!</p>
                </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Experiences;
