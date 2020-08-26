using ChatProject.ServicesClasses;
using ChatProject.Interfaces;

namespace ChatProject.Services
{
    public class DbInitializer
    {
        private readonly IDb _chatContext;
        public DbInitializer(ChatContext chatContext)
        {
            _chatContext = chatContext;
        }
        public bool CreateDb()
        {
            return _chatContext.CreateDb();
        }

    }
}
