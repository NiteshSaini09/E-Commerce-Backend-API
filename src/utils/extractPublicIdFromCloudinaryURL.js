const extractPublicId = (url) => {
  // Split the URL by the standard '/upload/' portion
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;

  // Remove the version segment (e.g., 'v123456789/') if it exists
  const publicIdWithExtension = parts[1].replace(/^v\d+\//, '');

  // Remove the file extension (e.g., '.jpg', '.png')
  const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
  
  return publicId;
};

export default extractPublicId