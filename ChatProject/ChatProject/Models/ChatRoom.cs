using ChatProject.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;

namespace ChatProject.Models
{
    public class ChatRoom: IColomsInitializ
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Private { get; set; }
        public string Password { get; set; }
        public int UserCount { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateLastMessage { get; set; }
        
        public void HasDefaultValue(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChatRoom>().Property(_ => _.Private).HasDefaultValue(false);
            modelBuilder.Entity<ChatRoom>().Property(_ => _.UserCount).HasDefaultValue(0);
            modelBuilder.Entity<ChatRoom>().Property(_ => _.DateCreated).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<ChatRoom>().Property(_ => _.DateLastMessage).HasDefaultValueSql("GETDATE()");
        }
    }

}
