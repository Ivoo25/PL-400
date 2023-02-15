using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Xrm.Sdk;

namespace Plugin
{
    public class PluginCSCode : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            //throw new NotImplementedException();
            IPluginExecutionContext context = (IPluginExecutionContext) serviceProvider.GetService(typeof(IPluginExecutionContext)); //its the same having whats in () at the beggining than at the end with as ...
            ITracingService tracingService = (ITracingService) serviceProvider.GetService(typeof(ITracingService));
            tracingService.Trace("Stage 1");
            if (!context.InputParameters.ContainsKey("Target"))
            {
                throw new InvalidPluginExecutionException("The target is not here");
            } 

            try
            {
                var entity = (Entity)context.InputParameters["Target"]; //Query for requests, and Result for response
                tracingService.Trace("Stage {0}", "2");
                if (entity.Attributes.ContainsKey("address1_line3")) //If theres a key, so theres a value here...
                {
                    string strAddress1Line3 = (string)entity["address1_line3"]; //this will fail if address1_line3 (in this case) is empty
                    tracingService.Trace("Stage {0}", "3");
                    entity["address1_line3"] = "The data was " + strAddress1Line3;
                    tracingService.Trace("Stage {0}", "4");
                    //I believe tracingService.Trace("Stage {0}", "[NUMBER]"); -> equals tracingService.Trace("Stage [NUMBER]");
                }
                else
                {
                    tracingService.Trace("Stage {0}", "5");
                    entity["address1_line3"] = "There is no data here...";
                    tracingService.Trace("Stage {0}", "6");
                }
            }
            catch
            {
                tracingService.Trace("Catch!");
                throw new InvalidPluginExecutionException("There was an error");
            }
            

        }
    }
}
