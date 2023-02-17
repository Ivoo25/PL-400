using System;
using System.Collections.Generic;
using System.IdentityModel.Metadata;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;

namespace Plugin
{
    public class PluginCSCode : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            //throw new NotImplementedException();
            IPluginExecutionContext context = (IPluginExecutionContext) serviceProvider.GetService(typeof(IPluginExecutionContext)); //its the same having whats in () at the beggining than at the end with as ...
            ITracingService tracingService = (ITracingService) serviceProvider.GetService(typeof(ITracingService));

            //WEB API -> Odata REST
            //Organization Services - .NET Framework SDK
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory) serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

            //Input parameters
            var targetEntity = (Entity)context.InputParameters["Target"];


            /*
             * Logical names:
             * Name -> cr5cd_name
             * Fax -> cr5cd_fax
             * Table -> cr5cd_accounts_ivo_copy
             * 
             * Table -> account
             * Name -> name
             * Fax -> fax
             */


            int stageNumber = 0;
            //tracingService.Trace("Stage {0}", ++stageNumber); //Increments Stage Number
            string currentAccountName = (string)targetEntity["name"];
            //tracingService.Trace("Stage {0}", ++stageNumber); //Increments Stage Number
            string currentFax = "";
            //tracingService.Trace("Stage {0}", ++stageNumber); //Increments Stage Number
            if (targetEntity.Attributes.ContainsKey("fax"))
            {
                currentFax = (string)targetEntity["fax"];
                //tracingService.Trace("Stage {0}", ++stageNumber); //Increments Stage Number
            }
            string newAccountName = currentAccountName + " (Copy)";
            //tracingService.Trace("Stage {0}", ++stageNumber); //Increments Stage Number

            var newAccount = new Entity("cr5cd_accounts_ivo_copy"); //Name of the table to populate with data I want
            newAccount["cr5cd_name"] = newAccountName; //Set value of CurrentAcountName (Copy) to my new column
            //tracingService.Trace("Stage {0}", ++stageNumber); //Increments Stage Number
            newAccount["cr5cd_fax"] = currentFax;
            //tracingService.Trace("Stage {0}", ++stageNumber); //Increments Stage Number

            //Guid accountID = service.Create(newAccount); //returns the account ID as a GUID -> Globally Unique Identifier. accountID is the response, and the other part is the request, this is a createrequest and a createresponse, we can break it in two, if we want 
            //duplicate detection rules to be applied
            //tracingService.Trace("Stage {0} {1}", ++stageNumber, accountID); //Increments Stage Number and retrieves the accountID

            var request = new CreateRequest() { Target = newAccount}; //Record to create -> Target
            var response = (CreateResponse) service.Execute(request);
            Guid accountID = response.id;

            //Update
            var existingAccountCopy = new Entity("cr5cd_accounts_ivo_copy", accountID);
            var updateAccountCopy = new Entity("cr5cd_accounts_ivo_copy");
            updateAccountCopy.Id = existingAccountCopy.Id;
            updateAccountCopy["cr5cd_fax"] = "3875809586";
            service.Update(updateAccountCopy);

            //Delete
            //service.Delete("cr5cd_accounts_ivo_copy", accountID);
            /*

            //Retrieve
            var retrieveEntity = service.Retrieve("cr5cd_accounts_ivo_copy", accountID, new ColumnSet("cr5cd_name", "cr5cd_fax")); //ColumnSet(true) retrieves all columns
            tracingService.Trace("Stage {0} {1} {2}", ++stageNumber, retrieveEntity["cr5cd_name"], retrieveEntity["cr5cd_fax"]);

            //Retrieve using alternative key (when we dont have the GUID)
            RetrieveRequest requestR = new RetrieveRequest() { ColumnSet = new ColumnSet("name", "fax"), Target = new EntityReference("account", "name", "Mi cuenta v5") };
            var responseR = (RetrieveResponse)service.Execute(requestR);
            Entity entityR = responseR.Entity;
            tracingService.Trace("Stage {0} {1}", ++stageNumber, entityR["fax"]);




            //Retrieve using alternative key (when we dont have the GUID) v2, when having a compound key
            var keyS = new KeyAttributeCollection();
            keyS.Add("name", "Mi cuenta v5"); //This is generic: -> keyS.Add("another field", "another value");

            RetrieveRequest requestS = new RetrieveRequest() { ColumnSet = new ColumnSet("name", "fax"), Target = new EntityReference("account", keyS)};
            var responseS = (RetrieveResponse)service.Execute(requestS);
            Entity entityS = responseS.Entity;
            tracingService.Trace("Stage {0} {1}", ++stageNumber, entityS["fax"]);

            */
            //Retrieve multiple, its simillar to retrieve but changes the Target
            //Retrieve Multiple

            //ConditionExpression
            ConditionExpression vCond = new ConditionExpression();
            vCond.AttributeName = "name";
            vCond.Operator = ConditionOperator.BeginsWith;
            vCond.Values.Add("Mi cuenta"); //checks for any name that starts with this

            //FilterExpression - contains conditionExpression
            FilterExpression vFilt = new FilterExpression();
            vFilt.Conditions.Add(vCond); //Add the condition to the filter

            //QueryExpression
            QueryExpression vQuery = new QueryExpression("account");
            //vQuery.ColumnSet.AddColumns("name");
            vQuery.ColumnSet.AllColumns = true; //If I want all columns... cant use this and the one above together, is one or another
            vQuery.Criteria.AddFilter(vFilt); //Add filter to expression

            EntityCollection vResult = service.RetrieveMultiple(vQuery);

            foreach(var oneResult in vResult.Entities)
            {
                string b1 = "";
                if(oneResult.Attributes.Contains("name"))
                {
                    b1 = (string)oneResult["name"];
                }
                string b2 = "No fax";
                if (oneResult.Attributes.Contains("fax"))
                {
                    b2 = (string)oneResult["fax"];
                }

                tracingService.Trace("Stage {0} {1} {2} {3}", ++stageNumber, b1, b2, "Lo hice yo solito :D");

            }

        }
    }
}

/*
 * THIS IS FROM A PREVIOUS VERSION, THIS GOES UNDER STAGE 1
 * if (!context.InputParameters.ContainsKey("Target"))
            {
                throw new InvalidPluginExecutionException("The target is not here");
            } 

            try
            {
                var entity = (Entity)context.InputParameters["Target"]; //Query for requests, and Result for response
                tracingService.Trace("Stage {0}", "2");
                if (entity.Attributes.ContainsKey("fax")) //If theres a key, so theres a value here...
                {
                    string newFax = (string)entity["fax"]; //this will fail if fax (in this case) is empty
                    var entityOld = (Entity)context.PreEntityImages["PreImage"];
                    
                    string oldFax = "";
                    if(entityOld.Attributes.ContainsKey("fax"))
                    {
                        //string oldFax = (string)context.PreEntityImages["PreImage"]["fax"]; //this saves me the context of the old value, the syntax is: PreEntitiyImages["ALIAS NAME"],["FIELD TO SAVE CONTEXT"]
                        oldFax = (string)entityOld["fax"];
                    } else
                    {
                        oldFax = "Nothing";
                    }
                   
                    tracingService.Trace("Stage {0}", "3");
                    entity["address1_line3"] = "The data was " + oldFax + " and is now" + newFax;
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

 */