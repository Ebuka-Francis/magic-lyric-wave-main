const BackgroundVideo = () => (
   <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed inset-0 w-full h-full object-cover z-[-1]" // CSS for fullscreen coverage and z-index to be behind content
   >
      <source src="./hero-video.mp4" type="video/mp4" />
   </video>
);

export default BackgroundVideo;
