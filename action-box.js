import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { LangMessages } from './langs';
import AdvertiseContact from './boxes/advertise-contact';
import ContactUs from './boxes/contact-us';
import EmailFriendBox from './boxes/email-friend-box';
import FindVisitorAdBox from './boxes/find-visitor-ad-box';
import ForgetPasswordBox from './boxes/forget-password-box';
import LoginBox from './boxes/login-box';
import Register from './boxes/register';
import SearchBox from './boxes/search-box';
import Loading from './boxes/loading';

class ActionBox extends Component {
	constructor(props) {
		super(props);
		this.setLanguage = this.setLanguage.bind(this);
		this.setMenus = this.setMenus.bind(this);
	}
	setLanguage() {
		this.props.objects.onSetLanguage();
	}
	setMenus() {
		this.props.objects.onExpandMenus();
	}
	render() {
		const menuClasses = ['menu_clker'];
		if(this.props.objects.menus) {
			menuClasses.push('menu_clker_active');
		}
		return (
			<nav id="ad_title_bar">
				<nav className="btn_list">
					<div id="menu_launcher">
						<div className={menuClasses.join(' ')} onClick={this.setMenus}>
							{LangMessages.c_menu[this.props.objects.language]}
						</div>
					</div>
					<Link className="react-link" onClick={this.props.objects.onClearScreen} to="/">
						<div className="nav_btn">
							{LangMessages.c_home[this.props.objects.language]}
						</div>
					</Link>
					<div className="nav_btn" onClick={this.setLanguage}>
						{LangMessages.c_language[this.props.objects.language]}
					</div>
					<div className="use_mobile">{LangMessages.c_use_mobile[this.props.objects.language]}</div>
					<div className="ad_action_box_wrapper">
						<AdvertiseContact objects={this.props.objects} />
						<ContactUs objects={this.props.objects} />
						<EmailFriendBox objects={this.props.objects} />
						<FindVisitorAdBox objects={this.props.objects} />
						<ForgetPasswordBox objects={this.props.objects} />
						<LoginBox objects={this.props.objects} />
						<Register objects={this.props.objects} />
						<SearchBox objects={this.props.objects} />
						<Loading objects={this.props.objects} />
					</div>
				</nav>
			</nav>		
		);
	};
}

export default ActionBox;
