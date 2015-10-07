using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MVC_WebApp.Startup))]
namespace MVC_WebApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
