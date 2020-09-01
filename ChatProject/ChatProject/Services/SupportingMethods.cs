using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Text;

namespace ChatProject.Services
{
    public class SupportingMethods
    {
        public virtual string GetHashString(string password)
        {
            MD5 md5Hash = MD5.Create();
            byte[] salt = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA1, 1000, 256 / 8));
        }
    }
}