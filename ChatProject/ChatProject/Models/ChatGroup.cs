using ChatProject.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
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
        public int MessageCount { get; set; }
        public DateTime DateCreated { get; set; }

        public void HasDefaultValue(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChatGroup>().Property(_ => _.Private).HasDefaultValue(false);
            modelBuilder.Entity<ChatGroup>().Property(_ => _.UserCount).HasDefaultValue(0);
            modelBuilder.Entity<ChatGroup>().Property(_ => _.MessageCount).HasDefaultValue(0);
            modelBuilder.Entity<ChatGroup>().Property(_ => _.DateCreated).HasDefaultValueSql("GETDATE()");
        }

       public DataShell Validate(){
            var regFormat = new Regex(@"^[а-яА-ЯёЁa-zA-Z0-9 \-+=_\?\!\(\)\<\>]{3,30}$", RegexOptions.Compiled | RegexOptions.Singleline);
            if(!regFormat.IsMatch(Name)){
                return new DataShell("chat name isn't valid");
            }
            regFormat = new Regex(@"^[a-zA-Z0-9 \-+=_\?\!\(\)\<\>]{3,30}$", RegexOptions.Compiled | RegexOptions.Singleline);
            if(Private && !regFormat.IsMatch(Password)){
               return new DataShell("password isn't valid");
            }
            return new DataShell();    
        }


    }

}
