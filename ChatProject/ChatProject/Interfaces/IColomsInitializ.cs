using Microsoft.EntityFrameworkCore;

namespace ChatProject.Interfaces
{
    public interface IColomsInitializ
    {
        public void HasDefaultValue(ModelBuilder modelBuilder)
        {
        }
    }
}
