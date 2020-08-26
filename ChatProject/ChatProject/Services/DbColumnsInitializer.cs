using ChatProject.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChatProject.Services
{
    public class DbColumnsInitializer
    {
        public void DefaultValuesInitializ(IColomsInitializ model, ModelBuilder modelBuilder)
        {
            model.HasDefaultValue(modelBuilder);
        }
    }
}
