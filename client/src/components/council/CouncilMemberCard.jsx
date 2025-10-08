import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter, FaGlobe, FaEdit } from 'react-icons/fa';

export const SocialLink = ({ icon, url, label, className = '' }) => {
  if (!url) return null;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors ${className}`}
      aria-label={label}
    >
      {icon}
    </a>
  );
};\n
const CouncilMemberCard = ({ member, isAdmin = false }) => {
  const { _id, name, role, bio, image, socialLinks = {} } = member;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={image || '/images/avatar-placeholder.png'}
          alt={name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/avatar-placeholder.png';
          }}
        />
        
        {isAdmin && (
          <div className="absolute top-2 right-2">
            <Link
              to={`/admin/council/edit/${_id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-600 shadow-md"
              title="Edit Member"
            >
              <FaEdit className="h-4 w-4" />
            </Link>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white font-semibold text-lg">{name}</h3>
          <p className="text-blue-200 text-sm">{role}</p>
        </div>
      </div>
      
      <div className="p-4">
        {bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {bio}
          </p>
        )}
        
        <div className="flex space-x-2">
          <SocialLink 
            url={socialLinks.linkedin} 
            icon={<FaLinkedin className="h-4 w-4 text-[#0077B5]" />} 
            label={`${name}'s LinkedIn`}
          />
          <SocialLink 
            url={socialLinks.github} 
            icon={<FaGithub className="h-4 w-4 text-gray-800" />} 
            label={`${name}'s GitHub`}
          />
          <SocialLink 
            url={socialLinks.twitter} 
            icon={<FaTwitter className="h-4 w-4 text-[#1DA1F2]" />} 
            label={`${name}'s Twitter`}
          />
          <SocialLink 
            url={socialLinks.website} 
            icon={<FaGlobe className="h-4 w-4 text-gray-700" />} 
            label={`${name}'s Website`}
          />
        </div>
      </div>
    </div>
  );
};

export default CouncilMemberCard;
