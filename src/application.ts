import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import {
	RestExplorerBindings,
	RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RestApplication } from '@loopback/rest';
import path from 'path';
import { MySequence } from './sequence';

import { AuthenticationComponent } from '@loopback/authentication';
import {
	JWTAuthenticationComponent,
	UserServiceBindings,
} from '@loopback/authentication-jwt';
import { DbDataSource } from './datasources';
import { ActionsInterceptor, IdInterceptor } from './interceptors';

export { ApplicationConfig };

export class IteamApplication extends BootMixin(
	RepositoryMixin(RestApplication)
) {
	constructor(options: ApplicationConfig = {}) {
		super(options);

		// Set up the custom sequence
		this.sequence(MySequence);

		// Set up default home page
		this.static('/', path.join(__dirname, '../public'));

		// Customize @loopback/rest-explorer configuration here
		this.configure(RestExplorerBindings.COMPONENT).to({
			path: '/explorer',
		});
		this.component(RestExplorerComponent);

		this.projectRoot = __dirname;
		// Customize @loopback/boot Booter Conventions here
		this.bootOptions = {
			controllers: {
				// Customize ControllerBooter Conventions here
				dirs: ['controllers'],
				extensions: ['.controller.js'],
				nested: true,
			},
		};

		this.component(AuthenticationComponent);
		// Mount jwt component
		this.component(JWTAuthenticationComponent);
		// Bind datasource
		this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);

		this.interceptor(ActionsInterceptor, {
			global: false,
			group: 'actions',
			key: 'actions-interceptor',
		});
		this.interceptor(IdInterceptor, {
			global: false,
			group: 'id',
			key: 'id-interceptor',
		});
	}
}
