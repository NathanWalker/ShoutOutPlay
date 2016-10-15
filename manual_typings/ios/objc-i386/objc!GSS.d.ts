
declare function GSSCreateCredentialFromUUID(uuid: any): interop.Pointer | interop.Reference<any>;

declare function GSSCreateError(mech: interop.Pointer | interop.Reference<gss_OID_desc>, major_status: number, minor_status: number): interop.Unmanaged<NSError>;

declare function GSSCreateName(name: any, name_type: interop.Pointer | interop.Reference<gss_OID_desc>, error: interop.Pointer | interop.Reference<NSError>): interop.Pointer | interop.Reference<any>;

declare function GSSCredentialCopyName(cred: interop.Pointer | interop.Reference<any>): interop.Pointer | interop.Reference<any>;

declare function GSSCredentialCopyUUID(credential: interop.Pointer | interop.Reference<any>): interop.Unmanaged<any>;

declare function GSSCredentialGetLifetime(cred: interop.Pointer | interop.Reference<any>): number;

declare function GSSNameCreateDisplayString(name: interop.Pointer | interop.Reference<any>): interop.Unmanaged<string>;

declare var __gss_appl_lkdc_supported_oid_desc: gss_OID_desc;

declare var __gss_c_attr_local_login_user: gss_buffer_desc;

declare var __gss_c_cred_certificate_oid_desc: gss_OID_desc;

declare var __gss_c_cred_diag_oid_desc: gss_OID_desc;

declare var __gss_c_cred_get_default_oid_desc: gss_OID_desc;

declare var __gss_c_cred_heimbase_oid_desc: gss_OID_desc;

declare var __gss_c_cred_password_oid_desc: gss_OID_desc;

declare var __gss_c_cred_renew_oid_desc: gss_OID_desc;

declare var __gss_c_cred_secidentity_oid_desc: gss_OID_desc;

declare var __gss_c_cred_set_default_oid_desc: gss_OID_desc;

declare var __gss_c_cred_validate_oid_desc: gss_OID_desc;

declare var __gss_c_ctx_pfs_x_oid_desc: gss_OID_desc;

declare var __gss_c_inq_sspi_session_key_oid_desc: gss_OID_desc;

declare var __gss_c_inq_win2k_pac_x_oid_desc: gss_OID_desc;

declare var __gss_c_ma_auth_init_anon_oid_desc: gss_OID_desc;

declare var __gss_c_ma_auth_init_init_oid_desc: gss_OID_desc;

declare var __gss_c_ma_auth_init_oid_desc: gss_OID_desc;

declare var __gss_c_ma_auth_targ_anon_oid_desc: gss_OID_desc;

declare var __gss_c_ma_auth_targ_init_oid_desc: gss_OID_desc;

declare var __gss_c_ma_auth_targ_oid_desc: gss_OID_desc;

declare var __gss_c_ma_cbindings_oid_desc: gss_OID_desc;

declare var __gss_c_ma_compress_oid_desc: gss_OID_desc;

declare var __gss_c_ma_conf_prot_oid_desc: gss_OID_desc;

declare var __gss_c_ma_ctx_trans_oid_desc: gss_OID_desc;

declare var __gss_c_ma_deleg_cred_oid_desc: gss_OID_desc;

declare var __gss_c_ma_deprecated_oid_desc: gss_OID_desc;

declare var __gss_c_ma_integ_prot_oid_desc: gss_OID_desc;

declare var __gss_c_ma_itok_framed_oid_desc: gss_OID_desc;

declare var __gss_c_ma_mech_composite_oid_desc: gss_OID_desc;

declare var __gss_c_ma_mech_concrete_oid_desc: gss_OID_desc;

declare var __gss_c_ma_mech_description_oid_desc: gss_OID_desc;

declare var __gss_c_ma_mech_glue_oid_desc: gss_OID_desc;

declare var __gss_c_ma_mech_name_oid_desc: gss_OID_desc;

declare var __gss_c_ma_mech_nego_oid_desc: gss_OID_desc;

declare var __gss_c_ma_mech_pseudo_oid_desc: gss_OID_desc;

declare var __gss_c_ma_mic_oid_desc: gss_OID_desc;

declare var __gss_c_ma_not_dflt_mech_oid_desc: gss_OID_desc;

declare var __gss_c_ma_not_mech_oid_desc: gss_OID_desc;

declare var __gss_c_ma_oos_det_oid_desc: gss_OID_desc;

declare var __gss_c_ma_pfs_oid_desc: gss_OID_desc;

declare var __gss_c_ma_prot_ready_oid_desc: gss_OID_desc;

declare var __gss_c_ma_replay_det_oid_desc: gss_OID_desc;

declare var __gss_c_ma_sasl_mech_name_oid_desc: gss_OID_desc;

declare var __gss_c_ma_wrap_oid_desc: gss_OID_desc;

declare var __gss_c_nt_anonymous_oid_desc: gss_OID_desc;

declare var __gss_c_nt_dn_oid_desc: gss_OID_desc;

declare var __gss_c_nt_export_name_oid_desc: gss_OID_desc;

declare var __gss_c_nt_hostbased_service_oid_desc: gss_OID_desc;

declare var __gss_c_nt_hostbased_service_x_oid_desc: gss_OID_desc;

declare var __gss_c_nt_machine_uid_name_oid_desc: gss_OID_desc;

declare var __gss_c_nt_ntlm_oid_desc: gss_OID_desc;

declare var __gss_c_nt_string_uid_name_oid_desc: gss_OID_desc;

declare var __gss_c_nt_user_name_oid_desc: gss_OID_desc;

declare var __gss_c_nt_uuid_oid_desc: gss_OID_desc;

declare var __gss_c_ntlm_force_v1_oid_desc: gss_OID_desc;

declare var __gss_c_ntlm_guest_oid_desc: gss_OID_desc;

declare var __gss_c_ntlm_reset_keys_oid_desc: gss_OID_desc;

declare var __gss_c_ntlm_session_key_oid_desc: gss_OID_desc;

declare var __gss_c_ntlm_support_channelbindings_oid_desc: gss_OID_desc;

declare var __gss_c_ntlm_support_lm2_oid_desc: gss_OID_desc;

declare var __gss_c_ntlm_v1_oid_desc: gss_OID_desc;

declare var __gss_c_ntlm_v2_oid_desc: gss_OID_desc;

declare var __gss_c_peer_has_updated_spnego_oid_desc: gss_OID_desc;

declare var __gss_iakerb_mechanism_oid_desc: gss_OID_desc;

declare var __gss_krb5_ccache_name_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_compat_des3_mic_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_copy_ccache_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_cred_no_ci_flags_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_export_lucid_context_v1_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_export_lucid_context_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_extract_authz_data_from_sec_context_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_get_acceptor_subkey_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_get_authtime_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_get_initiator_subkey_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_get_service_keyblock_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_get_subkey_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_get_time_offset_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_get_tkt_flags_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_import_cred_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_mechanism_oid_desc: gss_OID_desc;

declare var __gss_krb5_nt_principal_name_oid_desc: gss_OID_desc;

declare var __gss_krb5_nt_principal_name_oid_descVar: gss_OID_desc;

declare var __gss_krb5_nt_principal_name_referral_oid_desc: gss_OID_desc;

declare var __gss_krb5_nt_principal_name_referral_oid_descVar: gss_OID_desc;

declare var __gss_krb5_nt_principal_oid_desc: gss_OID_desc;

declare var __gss_krb5_nt_principal_oid_descVar: gss_OID_desc;

declare var __gss_krb5_plugin_register_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_register_acceptor_identity_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_send_to_kdc_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_set_allowable_enctypes_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_set_default_realm_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_set_dns_canonicalize_x_oid_desc: gss_OID_desc;

declare var __gss_krb5_set_time_offset_x_oid_desc: gss_OID_desc;

declare var __gss_netlogon_mechanism_oid_desc: gss_OID_desc;

declare var __gss_netlogon_nt_netbios_dns_name_oid_desc: gss_OID_desc;

declare var __gss_netlogon_set_session_key_x_oid_desc: gss_OID_desc;

declare var __gss_netlogon_set_sign_algorithm_x_oid_desc: gss_OID_desc;

declare var __gss_ntlm_get_session_key_x_oid_desc: gss_OID_desc;

declare var __gss_ntlm_mechanism_oid_desc: gss_OID_desc;

declare var __gss_pku2u_mechanism_oid_desc: gss_OID_desc;

declare var __gss_sasl_digest_md5_mechanism_oid_desc: gss_OID_desc;

declare var __gss_scram_mechanism_oid_desc: gss_OID_desc;

declare var __gss_spnego_mechanism_oid_desc: gss_OID_desc;

declare var __gss_spnego_mechanism_oid_descVar: gss_OID_desc;

interface gss_OID_desc {
	length: number;
	elements: interop.Pointer | interop.Reference<any>;
}
declare var gss_OID_desc: interop.StructType<gss_OID_desc>;

interface gss_OID_set_desc {
	count: number;
	elements: interop.Pointer | interop.Reference<gss_OID_desc>;
}
declare var gss_OID_set_desc: interop.StructType<gss_OID_set_desc>;

declare function gss_aapl_change_password(name: interop.Pointer | interop.Reference<any>, mech: interop.Pointer | interop.Reference<gss_OID_desc>, attributes: NSDictionary<any, any>, error: interop.Pointer | interop.Reference<NSError>): number;

declare function gss_aapl_initial_cred(desired_name: interop.Pointer | interop.Reference<any>, desired_mech: interop.Pointer | interop.Reference<gss_OID_desc>, attributes: NSDictionary<any, any>, output_cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, error: interop.Pointer | interop.Reference<NSError>): number;

declare function gss_accept_sec_context(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, acceptor_cred_handle: interop.Pointer | interop.Reference<any>, input_token: interop.Pointer | interop.Reference<gss_buffer_desc>, input_chan_bindings: interop.Pointer | interop.Reference<gss_channel_bindings_struct>, src_name: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, mech_type: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_desc>>, output_token: interop.Pointer | interop.Reference<gss_buffer_desc>, ret_flags: interop.Pointer | interop.Reference<number>, time_rec: interop.Pointer | interop.Reference<number>, delegated_cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_acquire_cred(minor_status: interop.Pointer | interop.Reference<number>, desired_name: interop.Pointer | interop.Reference<any>, time_req: number, desired_mechs: interop.Pointer | interop.Reference<gss_OID_set_desc>, cred_usage: number, output_cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, actual_mechs: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>, time_rec: interop.Pointer | interop.Reference<number>): number;

declare function gss_acquire_cred_with_password(minor_status: interop.Pointer | interop.Reference<number>, desired_name: interop.Pointer | interop.Reference<any>, password: interop.Pointer | interop.Reference<gss_buffer_desc>, time_req: number, desired_mechs: interop.Pointer | interop.Reference<gss_OID_set_desc>, cred_usage: number, output_cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, actual_mechs: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>, time_rec: interop.Pointer | interop.Reference<number>): number;

declare function gss_add_buffer_set_member(minor_status: interop.Pointer | interop.Reference<number>, member_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, buffer_set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_buffer_set_desc>>): number;

declare function gss_add_cred(minor_status: interop.Pointer | interop.Reference<number>, input_cred_handle: interop.Pointer | interop.Reference<any>, desired_name: interop.Pointer | interop.Reference<any>, desired_mech: interop.Pointer | interop.Reference<gss_OID_desc>, cred_usage: number, initiator_time_req: number, acceptor_time_req: number, output_cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, actual_mechs: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>, initiator_time_rec: interop.Pointer | interop.Reference<number>, acceptor_time_rec: interop.Pointer | interop.Reference<number>): number;

declare function gss_add_oid_set_member(minor_status: interop.Pointer | interop.Reference<number>, member_oid: interop.Pointer | interop.Reference<gss_OID_desc>, oid_set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

interface gss_buffer_desc {
	length: number;
	value: interop.Pointer | interop.Reference<any>;
}
declare var gss_buffer_desc: interop.StructType<gss_buffer_desc>;

interface gss_buffer_set_desc {
	count: number;
	elements: interop.Pointer | interop.Reference<gss_buffer_desc>;
}
declare var gss_buffer_set_desc: interop.StructType<gss_buffer_set_desc>;

declare function gss_canonicalize_name(minor_status: interop.Pointer | interop.Reference<number>, input_name: interop.Pointer | interop.Reference<any>, mech_type: interop.Pointer | interop.Reference<gss_OID_desc>, output_name: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

interface gss_channel_bindings_struct {
	initiator_addrtype: number;
	initiator_address: gss_buffer_desc;
	acceptor_addrtype: number;
	acceptor_address: gss_buffer_desc;
	application_data: gss_buffer_desc;
}
declare var gss_channel_bindings_struct: interop.StructType<gss_channel_bindings_struct>;

declare function gss_compare_name(minor_status: interop.Pointer | interop.Reference<number>, name1_arg: interop.Pointer | interop.Reference<any>, name2_arg: interop.Pointer | interop.Reference<any>, name_equal: interop.Pointer | interop.Reference<number>): number;

declare function gss_context_time(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, time_rec: interop.Pointer | interop.Reference<number>): number;

declare function gss_create_empty_buffer_set(minor_status: interop.Pointer | interop.Reference<number>, buffer_set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_buffer_set_desc>>): number;

declare function gss_create_empty_oid_set(minor_status: interop.Pointer | interop.Reference<number>, oid_set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

declare function gss_decapsulate_token(input_token: interop.Pointer | interop.Reference<gss_buffer_desc>, oid: interop.Pointer | interop.Reference<gss_OID_desc>, output_token: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_delete_sec_context(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, output_token: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_destroy_cred(min_stat: interop.Pointer | interop.Reference<number>, cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_display_mech_attr(minor_status: interop.Pointer | interop.Reference<number>, mech_attr: interop.Pointer | interop.Reference<gss_OID_desc>, name: interop.Pointer | interop.Reference<gss_buffer_desc>, short_desc: interop.Pointer | interop.Reference<gss_buffer_desc>, long_desc: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_display_name(minor_status: interop.Pointer | interop.Reference<number>, input_name: interop.Pointer | interop.Reference<any>, output_name_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, output_name_type: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_desc>>): number;

declare function gss_display_status(minor_status: interop.Pointer | interop.Reference<number>, status_value: number, status_type: number, mech_type: interop.Pointer | interop.Reference<gss_OID_desc>, message_content: interop.Pointer | interop.Reference<number>, status_string: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_duplicate_name(minor_status: interop.Pointer | interop.Reference<number>, src_name: interop.Pointer | interop.Reference<any>, dest_name: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_duplicate_oid(minor_status: interop.Pointer | interop.Reference<number>, src_oid: interop.Pointer | interop.Reference<gss_OID_desc>, dest_oid: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_desc>>): number;

declare function gss_encapsulate_token(input_token: interop.Pointer | interop.Reference<gss_buffer_desc>, oid: interop.Pointer | interop.Reference<gss_OID_desc>, output_token: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_export_cred(minor_status: interop.Pointer | interop.Reference<number>, cred_handle: interop.Pointer | interop.Reference<any>, token: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_export_name(minor_status: interop.Pointer | interop.Reference<number>, input_name: interop.Pointer | interop.Reference<any>, exported_name: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_export_sec_context(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, interprocess_token: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_get_mic(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, qop_req: number, message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, message_token: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_import_cred(minor_status: interop.Pointer | interop.Reference<number>, token: interop.Pointer | interop.Reference<gss_buffer_desc>, cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_import_name(minor_status: interop.Pointer | interop.Reference<number>, input_name_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, input_name_type: interop.Pointer | interop.Reference<gss_OID_desc>, output_name: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_import_sec_context(minor_status: interop.Pointer | interop.Reference<number>, interprocess_token: interop.Pointer | interop.Reference<gss_buffer_desc>, context_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_indicate_mechs(minor_status: interop.Pointer | interop.Reference<number>, mech_set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

declare function gss_indicate_mechs_by_attrs(minor_status: interop.Pointer | interop.Reference<number>, desired_mech_attrs: interop.Pointer | interop.Reference<gss_OID_set_desc>, except_mech_attrs: interop.Pointer | interop.Reference<gss_OID_set_desc>, critical_mech_attrs: interop.Pointer | interop.Reference<gss_OID_set_desc>, mechs: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

declare function gss_init_sec_context(minor_status: interop.Pointer | interop.Reference<number>, initiator_cred_handle: interop.Pointer | interop.Reference<any>, context_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, target_name: interop.Pointer | interop.Reference<any>, input_mech_type: interop.Pointer | interop.Reference<gss_OID_desc>, req_flags: number, time_req: number, input_chan_bindings: interop.Pointer | interop.Reference<gss_channel_bindings_struct>, input_token: interop.Pointer | interop.Reference<gss_buffer_desc>, actual_mech_type: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_desc>>, output_token: interop.Pointer | interop.Reference<gss_buffer_desc>, ret_flags: interop.Pointer | interop.Reference<number>, time_rec: interop.Pointer | interop.Reference<number>): number;

declare function gss_inquire_attrs_for_mech(minor_status: interop.Pointer | interop.Reference<number>, mech: interop.Pointer | interop.Reference<gss_OID_desc>, mech_attr: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>, known_mech_attrs: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

declare function gss_inquire_context(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, src_name: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, targ_name: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, lifetime_rec: interop.Pointer | interop.Reference<number>, mech_type: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_desc>>, ctx_flags: interop.Pointer | interop.Reference<number>, locally_initiated: interop.Pointer | interop.Reference<number>, xopen: interop.Pointer | interop.Reference<number>): number;

declare function gss_inquire_cred(minor_status: interop.Pointer | interop.Reference<number>, cred_handle: interop.Pointer | interop.Reference<any>, name_ret: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, lifetime: interop.Pointer | interop.Reference<number>, cred_usage: interop.Pointer | interop.Reference<number>, mechanisms: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

declare function gss_inquire_cred_by_mech(minor_status: interop.Pointer | interop.Reference<number>, cred_handle: interop.Pointer | interop.Reference<any>, mech_type: interop.Pointer | interop.Reference<gss_OID_desc>, cred_name: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, initiator_lifetime: interop.Pointer | interop.Reference<number>, acceptor_lifetime: interop.Pointer | interop.Reference<number>, cred_usage: interop.Pointer | interop.Reference<number>): number;

declare function gss_inquire_cred_by_oid(minor_status: interop.Pointer | interop.Reference<number>, cred_handle: interop.Pointer | interop.Reference<any>, desired_object: interop.Pointer | interop.Reference<gss_OID_desc>, data_set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_buffer_set_desc>>): number;

declare function gss_inquire_mech_for_saslname(minor_status: interop.Pointer | interop.Reference<number>, sasl_mech_name: interop.Pointer | interop.Reference<gss_buffer_desc>, mech_type: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_desc>>): number;

declare function gss_inquire_mechs_for_name(minor_status: interop.Pointer | interop.Reference<number>, input_name: interop.Pointer | interop.Reference<any>, mech_types: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

declare function gss_inquire_name(minor_status: interop.Pointer | interop.Reference<number>, input_name: interop.Pointer | interop.Reference<any>, name_is_MN: interop.Pointer | interop.Reference<number>, MN_mech: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_desc>>, attrs: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_buffer_set_desc>>): number;

declare function gss_inquire_names_for_mech(minor_status: interop.Pointer | interop.Reference<number>, mechanism: interop.Pointer | interop.Reference<gss_OID_desc>, name_types: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

declare function gss_inquire_saslname_for_mech(minor_status: interop.Pointer | interop.Reference<number>, desired_mech: interop.Pointer | interop.Reference<gss_OID_desc>, sasl_mech_name: interop.Pointer | interop.Reference<gss_buffer_desc>, mech_name: interop.Pointer | interop.Reference<gss_buffer_desc>, mech_description: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_inquire_sec_context_by_oid(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, desired_object: interop.Pointer | interop.Reference<gss_OID_desc>, data_set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_buffer_set_desc>>): number;

interface gss_iov_buffer_desc {
	type: number;
	buffer: gss_buffer_desc;
}
declare var gss_iov_buffer_desc: interop.StructType<gss_iov_buffer_desc>;

declare function gss_iter_creds(min_stat: interop.Pointer | interop.Reference<number>, flags: number, mech: interop.Pointer | interop.Reference<gss_OID_desc>, useriter: (p1: interop.Pointer | interop.Reference<gss_OID_desc>, p2: interop.Pointer | interop.Reference<any>) => void): number;

declare function gss_iter_creds_f(min_stat: interop.Pointer | interop.Reference<number>, flags: number, mech: interop.Pointer | interop.Reference<gss_OID_desc>, userctx: interop.Pointer | interop.Reference<any>, useriter: interop.FunctionReference<(p1: interop.Pointer | interop.Reference<any>, p2: interop.Pointer | interop.Reference<gss_OID_desc>, p3: interop.Pointer | interop.Reference<any>) => void>): number;

declare function gss_krb5_ccache_name(minor_status: interop.Pointer | interop.Reference<number>, name: string, out_name: interop.Pointer | interop.Reference<string>): number;

interface gss_krb5_cfx_keydata_t {
	have_acceptor_subkey: number;
	ctx_key: gss_krb5_lucid_key_t;
	acceptor_subkey: gss_krb5_lucid_key_t;
}
declare var gss_krb5_cfx_keydata_t: interop.StructType<gss_krb5_cfx_keydata_t>;

declare function gss_krb5_copy_ccache(minor_status: interop.Pointer | interop.Reference<number>, cred: interop.Pointer | interop.Reference<any>, out: interop.Pointer | interop.Reference<any>): number;

declare function gss_krb5_export_lucid_sec_context(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, version: number, rctx: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_krb5_free_lucid_sec_context(minor_status: interop.Pointer | interop.Reference<number>, c: interop.Pointer | interop.Reference<any>): number;

interface gss_krb5_lucid_context_v1_t {
	version: number;
	initiate: number;
	endtime: number;
	send_seq: number;
	recv_seq: number;
	protocol: number;
	rfc1964_kd: gss_krb5_rfc1964_keydata_t;
	cfx_kd: gss_krb5_cfx_keydata_t;
}
declare var gss_krb5_lucid_context_v1_t: interop.StructType<gss_krb5_lucid_context_v1_t>;

interface gss_krb5_lucid_context_version_t {
	version: number;
}
declare var gss_krb5_lucid_context_version_t: interop.StructType<gss_krb5_lucid_context_version_t>;

interface gss_krb5_lucid_key_t {
	type: number;
	length: number;
	data: interop.Pointer | interop.Reference<any>;
}
declare var gss_krb5_lucid_key_t: interop.StructType<gss_krb5_lucid_key_t>;

interface gss_krb5_rfc1964_keydata_t {
	sign_alg: number;
	seal_alg: number;
	ctx_key: gss_krb5_lucid_key_t;
}
declare var gss_krb5_rfc1964_keydata_t: interop.StructType<gss_krb5_rfc1964_keydata_t>;

declare function gss_krb5_set_allowable_enctypes(minor_status: interop.Pointer | interop.Reference<number>, cred: interop.Pointer | interop.Reference<any>, num_enctypes: number, enctypes: interop.Pointer | interop.Reference<number>): number;

declare function gss_oid_equal(a: interop.Pointer | interop.Reference<gss_OID_desc>, b: interop.Pointer | interop.Reference<gss_OID_desc>): number;

declare function gss_oid_to_str(minor_status: interop.Pointer | interop.Reference<number>, oid: interop.Pointer | interop.Reference<gss_OID_desc>, oid_str: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_process_context_token(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, token_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_pseudo_random(minor_status: interop.Pointer | interop.Reference<number>, context: interop.Pointer | interop.Reference<any>, prf_key: number, prf_in: interop.Pointer | interop.Reference<gss_buffer_desc>, desired_output_len: number, prf_out: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_release_buffer(minor_status: interop.Pointer | interop.Reference<number>, buffer: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_release_buffer_set(minor_status: interop.Pointer | interop.Reference<number>, buffer_set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_buffer_set_desc>>): number;

declare function gss_release_cred(minor_status: interop.Pointer | interop.Reference<number>, cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_release_name(minor_status: interop.Pointer | interop.Reference<number>, input_name: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>): number;

declare function gss_release_oid(minor_status: interop.Pointer | interop.Reference<number>, oid: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_desc>>): number;

declare function gss_release_oid_set(minor_status: interop.Pointer | interop.Reference<number>, set: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<gss_OID_set_desc>>): number;

declare function gss_seal(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, conf_req_flag: number, qop_req: number, input_message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, conf_state: interop.Pointer | interop.Reference<number>, output_message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_set_cred_option(minor_status: interop.Pointer | interop.Reference<number>, cred_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, object: interop.Pointer | interop.Reference<gss_OID_desc>, value: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_set_sec_context_option(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<interop.Pointer | interop.Reference<any>>, object: interop.Pointer | interop.Reference<gss_OID_desc>, value: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_sign(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, qop_req: number, message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, message_token: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_test_oid_set_member(minor_status: interop.Pointer | interop.Reference<number>, member: interop.Pointer | interop.Reference<gss_OID_desc>, set: interop.Pointer | interop.Reference<gss_OID_set_desc>, present: interop.Pointer | interop.Reference<number>): number;

declare function gss_unseal(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, input_message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, output_message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, conf_state: interop.Pointer | interop.Reference<number>, qop_state: interop.Pointer | interop.Reference<number>): number;

declare function gss_unwrap(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, input_message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, output_message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, conf_state: interop.Pointer | interop.Reference<number>, qop_state: interop.Pointer | interop.Reference<number>): number;

declare function gss_userok(name: interop.Pointer | interop.Reference<any>, user: string): number;

declare function gss_verify(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, token_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, qop_state: interop.Pointer | interop.Reference<number>): number;

declare function gss_verify_mic(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, token_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, qop_state: interop.Pointer | interop.Reference<number>): number;

declare function gss_wrap(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, conf_req_flag: number, qop_req: number, input_message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>, conf_state: interop.Pointer | interop.Reference<number>, output_message_buffer: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gss_wrap_size_limit(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, conf_req_flag: number, qop_req: number, req_output_size: number, max_input_size: interop.Pointer | interop.Reference<number>): number;

declare function gsskrb5_extract_authz_data_from_sec_context(minor_status: interop.Pointer | interop.Reference<number>, context_handle: interop.Pointer | interop.Reference<any>, ad_type: number, ad_data: interop.Pointer | interop.Reference<gss_buffer_desc>): number;

declare function gsskrb5_register_acceptor_identity(identity: string): number;

declare function krb5_gss_register_acceptor_identity(identity: string): number;
