import React, { useState } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
     <CDBSidebar backgroundColor="rgb(0 0 0)" textColor="#fff" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
        </CDBSidebarHeader> */}
        <CDBSidebarContent className="sidebar-content">
        <div style={{ paddingLeft: '20px', marginTop: '10px'}}>
          <CDBSidebarMenu>
            <NavLink exact to="/dashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns" >DASHBOARD</CDBSidebarMenuItem>
            </NavLink>
            
            <NavLink activeClassName="activeClicked">
            <CDBSidebarMenuItem onClick={toggleDropdown} icon="sticky-note">PRODUCT</CDBSidebarMenuItem>
            {isDropdownOpen && (
          <div style={{ paddingLeft: '20px', marginTop: '10px'}}>
            {/* Dropdown content */}
 
            <NavLink exact to="/admin/products" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">ALL</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/product" target="_blank" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">CREATE</CDBSidebarMenuItem>
            </NavLink>
          </div>
        
        )}
            </NavLink>
            <NavLink exact to="/admin/orders" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="shopping-cart">ORDERS</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/users" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">USERS</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/reviews" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">REVIEWS</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
          </div>
        </CDBSidebarContent> 
      </CDBSidebar>
     
  );
};

export default Sidebar;
