import React from "react";
import { IndexRoute, Route, browserHistory } from "react-router";
import { observer, Provider } from "mobx-react";

import { Grid, Row, Col, MainContainer, Alert } from "@sketchpixy/rubix";

import Footer from "./common/footer";
import Header from "./common/header";
import Sidebar from "./common/sidebar";
import Login from "./common/login";
import Register from "./common/register";

import PasswordNew from "./common/password/password-new";
import PasswordEdit from "./common/password/password-edit";

import Home from "./routes/home";

import BoatClasses from "./routes/boat-classes";
import BoatClassEditForm from "./components/boat-class/boat-class-edit-form";
import BoatClassAddForm from "./components/boat-class/boat-class-add-form";
import BoatClassWaitlists from "./routes/boat-class-waitlist";

import Boats from "./routes/boats";
import BoatAddForm from "./components/boat/boat-add-form";
import BoatEditForm from "./components/boat/boat-edit-form";
import BoatBooking from "./components/boat/boat-booking";

import Users from "./routes/users";
import UserAddForm from "./components/user/user-add-form";
import UserEditForm from "./components/user/user-edit-form";
import UserFormEndorsement from "./components/user/user-form-endorsement";
import UserBookings from "./components/user/user-bookings";
import UserNotes from "./components/user/user-notes";

import Group from "./routes/group";
import GroupAddForm from "./components/group/group-add-form";
import GroupEditForm from "./components/group/group-edit-form";

import BoatAmenities from "./routes/boat-amenities";
import BoatAmenityAddForm from "./components/boat-amentary/boat-amenity-add-form";
import BoatAmenityEditForm from "./components/boat-amentary/boat-amenity-edit-form";

import Lessons from "./routes/lessons";
import LessonAddForm from "./components/lesson/lesson-add-form";
import LessonBookForm from "./components/lesson/lesson-book-form";
import LessonEditForm from "./components/lesson/lesson-edit-form";

import Bookings from "./routes/bookings";
import BookingRedFlags from "./routes/booking-red-flags";
import BookingAddForm from "./components/booking/booking-add-form";
import BookingAddHappyHourForm from "./components/booking/booking-add-happy-hour-form";
import BookingDetail from "./components/booking/booking-detail";
import BookingEdit from "./components/booking/routes/booking-edit";
import BookingStart from "./components/booking/booking-start";
import BookingPendingComplete from "./components/booking/booking-pending-complete";
import BookingViewImages from "./components/booking/booking-view-images";
import BookingComplete from "./components/booking/booking-complete";

import BookingChecklistCategories from "./routes/booking-checklist-categories";
import BookingChecklistCategoryEditForm from "./components/booking-checklist-category/booking-checklist-category-edit-form";
import BookingChecklistCategoryAddForm from "./components/booking-checklist-category/booking-checklist-category-add-form";

import Transactions from "./routes/transactions";
import Settings from "./routes/settings";
import BookingSettings from "./routes/booking-settings";

import Seasons from "./routes/seasons";
import MembershipWaitlists from "./routes/membership-waitlists";
import PricingSettings from "./routes/pricing-settings";
import BrandingSettings from "./routes/branding-settings";
import EmailTemplates from "./routes/email-templates";
import Endorsements from "./routes/endorsements";

// User-side
import HeaderUserSide from "./common/header-user-side";

import UserHome from "./components/user-side/home/home";
import UserProfile from "./components/user-side/profile/profile";
import UserProfileJoinGroup from "./components/user-side/profile/profile-join-group";
import UserBookingAddForm from "./components/user-side/booking/booking-add-form";
import UserBookingAddHappyHourForm from "./components/user-side/booking/booking-add-happy-hour-form";
import UserBookingDetail from "./components/user-side/booking/booking-detail";
import UserSideLessons from "./components/user-side/lesson/lessons";
import UserSideLessonDetail from "./components/user-side/lesson/lesson-detail";

import ModalAlert from "./components/_core/modal-alert.js";

import BoatShareStore from "./stores/boat-share-store";
import NewBookingStore from "./stores/new-booking-store";
import HomebaseSettings from "./routes/homebase-settings";
import AddonEditForm from "./components/addon/addon-edit-form";
import AddonAddForm from "./components/addon/addon-add-form";
import Addons from "./routes/addons";
// import DevTools from "mobx-react-devtools";
// import { configureDevtool } from "mobx-react-devtools";

// Any configurations are optional
// configureDevtool({
//   // Turn on logging changes button programmatically:
//   logEnabled: true,
//   // Turn off displaying components updates button programmatically:
//   updatesEnabled: false
//   // Log only changes of type `reaction`
//   // (only affects top-level messages in console, not inside groups)
//   // logFilter: change => change.type === "reaction"
// });

const boatShareStore = new BoatShareStore();
const newBookingStore = new NewBookingStore();

@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    var handleErrorFn = this.handleError.bind(this);
    var handleSuccessFn = this.handleSuccess.bind(this);
    var handleShowAlertFn = this.handleShowAlert.bind(this);

    //Register ajaxError globally
    //This is not a recommended way by React!
    if (!window.registerdGlobalEvents) {
      $(document).ajaxError(handleErrorFn);
      $(document).ajaxSuccess(handleSuccessFn);

      //Register show alert popup
      $(document).on("ei:showAlert", handleShowAlertFn);
      window.registerdGlobalEvents = true;
    }

    this.state = {
      message: ""
    };

    moment.tz.setDefault("America/Los_Angeles");
  }

  handleShowAlert(event, arg1) {
    var message;
    if (typeof arg1 == "object") {
      var { errors } = arg1;
      let errorKeys = Object.keys(errors);

      message = errorKeys.length ? (
        <Alert danger dismissible>
          {errorKeys.map((field, i) => {
            return (
              <div key={i}>
                <div>
                  <strong>{field}:</strong>
                </div>
                <ul>
                  {errors[field].map((error, j) => {
                    return <li key={j}>{error}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </Alert>
      ) : null;

      this.setState({
        message: message
      });
      this.alertModal.open();
    } else {
      message = arg1;
      $.growl.error({ message: message });
    }
  }

  handleError(event, jqxhr, settings, thrownError) {
    try {
      switch (jqxhr.status) {
        case 401:
        case 400:
        case 500:
          let resObj = JSON.parse(jqxhr.responseText);
          let message = resObj.error;

          if (typeof message != "undefined" && message.length > 0) {
            $.growl.error({ message: message });
          } else {
            console.warn("The error message from server is not valid, please check!!!", jqxhr.responseText);
          }
          break;
        default:
          console.log("This status code is not handled globally: ", jqxhr.status);
      }
    } catch (e) {
      console.warn(
        "The error response from server is not in JSON format, please check!!!",
        jqxhr.responseText,
        e,
        jqxhr
      );
    }
  }

  handleSuccess(event, jqxhr, settings, data) {
    if (data && data.is_notification && data.message) {
      if (data.type == "error") {
        $.growl.error({ message: data.message });
      } else {
        $.growl.notice({ message: data.message });
      }
    }
  }

  render() {
    return (
      // TODO: Using Provider here to make admin side working. This should be considered later
      <Provider store={boatShareStore} newBookingStore={newBookingStore}>
        <MainContainer {...this.props}>
          <Sidebar />
          <Header />
          <div id="body">
            <Grid>
              <Row>
                <Col xs={12}>{this.props.children}</Col>
              </Row>
            </Grid>
            <ModalAlert message={this.state.message} ref={c => (this.alertModal = c)} />
          </div>
          <Footer />
          {/* <DevTools /> */}
        </MainContainer>
      </Provider>
    );
  }
}

@observer
class AppUserSide extends App {
  render() {
    return (
      <Provider store={boatShareStore} newBookingStore={newBookingStore}>
        <div>
          <HeaderUserSide />
          <div id="body">
            <Grid>
              <Row>
                <Col xs={12}>{this.props.children}</Col>
              </Row>
            </Grid>
            <ModalAlert message={this.state.message} ref={c => (this.alertModal = c)} />
          </div>
          <Footer is_user />
        </div>
      </Provider>
    );
  }
}

/**
 * Includes Sidebar, Header and Footer.
 */
const routes = (
  <Route path="/">
    <Route path="admin/" component={App}>
      <Route path="dashboard" component={Home} />
      <Route path="boat_classes" component={BoatClasses} />
      <Route path="boat_classes/new" component={BoatClassAddForm} />
      <Route path="boat_classes/:id/edit" component={BoatClassEditForm} />

      <Route path="boats" component={Boats} />
      <Route path="boats/new" component={BoatAddForm} />
      <Route path="boats/:id/edit" component={BoatEditForm} />
      <Route path="boats/:id/booking" component={BoatBooking} />

      <Route path="users" component={Users} />
      <Route path="users/new" component={UserAddForm} />
      <Route path="users/:id/edit" component={UserEditForm} />
      <Route path="users/:id/endorsement" component={UserFormEndorsement} />
      <Route path="users/:id/bookings" component={UserBookings} />
      <Route path="users/:id/notes" component={UserNotes} />

      <Route path="groups" component={Group} />
      <Route path="groups/new" component={GroupAddForm} />
      <Route path="groups/:id/edit" component={GroupEditForm} />

      <Route path="boat_amenities" component={BoatAmenities} />
      <Route path="boat_amenities/new" component={BoatAmenityAddForm} />
      <Route path="boat_amenities/:id/edit" component={BoatAmenityEditForm} />

      <Route path="lessons" component={Lessons} />
      <Route path="lessons/new" component={LessonAddForm} />
      <Route path="lessons/book" component={LessonBookForm} />
      <Route path="lessons/:id/edit" component={LessonEditForm} />

      <Route path="bookings" component={Bookings} />
      <Route path="bookings/bookings_red_flags" component={BookingRedFlags} />
      <Route path="bookings/new" component={BookingAddForm} />
      <Route path="bookings/new_happy_hour" component={BookingAddHappyHourForm} />
      <Route path="bookings/:id" component={BookingDetail} />
      <Route path="bookings/:id/edit" component={BookingEdit} />
      <Route path="bookings/:id/start" component={BookingStart} />
      <Route path="bookings/:id/complete" component={BookingComplete} />
      <Route path="bookings/:id/check_in_boat" component={BookingPendingComplete} />
      <Route path="bookings/:id/view_images" component={BookingViewImages} />

      <Route path="booking_checklist_categories" component={BookingChecklistCategories} />
      <Route path="booking_checklist_categories/new" component={BookingChecklistCategoryAddForm} />
      <Route path="booking_checklist_categories/:id/edit" component={BookingChecklistCategoryEditForm} />

      <Route path="boat_class_waitlists" component={BoatClassWaitlists} />
      <Route path="transactions" component={Transactions} />
      <Route path="settings" component={Settings} />
      <Route path="booking_settings" component={BookingSettings} />
      <Route path="seasons" component={Seasons} />
      <Route path="membership_waitlists" component={MembershipWaitlists} />
      <Route path="pricing_settings" component={PricingSettings} />
      <Route path="branding_settings" component={BrandingSettings} />
      <Route path="email_templates" component={EmailTemplates} />
      <Route path="homebase_settings" component={HomebaseSettings} />
      <Route path="endorsements" component={Endorsements} />
      <Route path="addons" component={Addons} />
      <Route path="addons/new" component={AddonAddForm} />
      <Route path="addons/:id/edit" component={AddonEditForm} />
    </Route>

    <Route component={AppUserSide}>
      <Route path="dashboard" component={UserHome} />
      <Route path="dashboard_confirmed" component={UserHome} />
      <Route path="profile" component={UserProfile} />
      <Route path="groups/:id/join" component={UserProfileJoinGroup} />
      <Route path="bookings/new" component={UserBookingAddForm} />
      <Route path="bookings/new_happy_hour" component={UserBookingAddHappyHourForm} />
      <Route path="bookings/:id" component={UserBookingDetail} />
      <Route path="lessons" component={UserSideLessons} />
      <Route path="lessons/:id" component={UserSideLessonDetail} />
    </Route>
  </Route>
);

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
  <Route>
    <Route path="login" component={Login} store={boatShareStore} />
    <Route path="register" component={Register} store={boatShareStore} />
    <Route path="passwords/new" component={PasswordNew} store={boatShareStore} />
    <Route path="passwords/:id/edit" component={PasswordEdit} store={boatShareStore} />
  </Route>
);

const combinedRoutes = (
  <Route>
    <Route>{routes}</Route>
    <Route>{basicRoutes}</Route>
  </Route>
);

export default (
  <Route path="/" history={browserHistory}>
    {combinedRoutes}
  </Route>
);
