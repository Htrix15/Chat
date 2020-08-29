using System.ComponentModel.DataAnnotations.Schema;
using ChatProject.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using ChatProject.ServicesClasses;
using System.Text.RegularExpressions;

namespace ChatProject.Models
{
    public class ChatGroup: IColomsInitializ, IData, IValidator
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
            modelBuilder.Entity<ChatGroup>().Property(_ => _.Private).HasDefaultValue(false);
            modelBuilder.Entity<ChatGroup>().Property(_ => _.UserCount).HasDefaultValue(0);
            modelBuilder.Entity<ChatGroup>().Property(_ => _.DateCreated).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<ChatGroup>().Property(_ => _.DateLastMessage).HasDefaultValueSql("GETDATE()");
        }

       public DataShell Validate(){
            var regFormat = new Regex(@"^[а-яА-ЯёЁa-zA-Z0-9 \-+=_\?\!\(\)\<\>]{1,30}$", RegexOptions.Compiled | RegexOptions.Singleline);
            if(!regFormat.IsMatch(Name)){
                return new DataShell("chat name isn't valid");
            }
            if(Private && Password.Length>25){
               return new DataShell("password there is invalid length");
            }
            return new DataShell();    
        }


    }

}
