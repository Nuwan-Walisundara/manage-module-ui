package com.wso2telco.dep.manageservice.resource.resource;

import javax.ws.rs.core.Response;

import com.wso2telco.dep.manageservice.resource.model.Callback;
import com.wso2telco.dep.manageservice.resource.service.ServiceFactory;
import com.wso2telco.dep.manageservice.resource.service.Serviceable;
import com.wso2telco.dep.manageservice.resource.util.ServiceTypes;

public abstract class AbstractResource {

	ServiceFactory serviceFactory = ServiceFactory.getInstance();
	
	protected abstract ServiceTypes getService();
	
	protected Response doGet( String authenticationCredential) {
		Serviceable service = serviceFactory.getService(getService());
		
		Callback callback = service.executeGet( authenticationCredential);
		return Response.status(Response.Status.OK).entity(callback).build();
	}
	
	protected Response doPost(RequestTransferrable request, String authenticationCredential) {
		Serviceable service = serviceFactory.getService(getService());
		
		Callback callback = service.executePost(request, authenticationCredential);
		return Response.status(Response.Status.OK).entity(callback).build();
	}
}