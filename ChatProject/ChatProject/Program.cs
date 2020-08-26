using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using ChatProject.Services;

namespace ChatProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            bool dbCreated = false;
            var host = CreateHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var logger = services.GetRequiredService<ILogger<Program>>();

                try
                {
                    var dbInitializer = services.GetRequiredService<DbInitializer>();
                    dbCreated = dbInitializer.CreateDb();
                    if (!dbCreated)
                    {
                        throw new Exception();
                    }
                }
                catch (Exception ex)
                {   
                    logger.LogError(ex, "Initialization database error");
                }
            }

            if (dbCreated)
            {
                host.Run();
            }

        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
