<?php
/**
 * Plugin Name: Nexora Custom Post Types
 * Description: Registers Career and Case Study CPTs with GraphQL + ACF fields used by the Next.js frontend.
 * Version: 1.0.0
 */

add_action('init', function () {
  register_post_type('career', [
    'label'              => 'Careers',
    'labels'             => ['name' => 'Careers', 'singular_name' => 'Career'],
    'public'             => true,
    'has_archive'        => true,
    'show_in_rest'       => true,
    'show_in_graphql'    => true,
    'graphql_single_name'=> 'career',
    'graphql_plural_name'=> 'careers',
    'supports'           => ['title', 'editor', 'excerpt', 'custom-fields'],
    'menu_icon'          => 'dashicons-businessperson',
  ]);

  register_post_type('case_study', [
    'label'              => 'Case Studies',
    'labels'             => ['name' => 'Case Studies', 'singular_name' => 'Case Study'],
    'public'             => true,
    'has_archive'        => true,
    'show_in_rest'       => true,
    'show_in_graphql'    => true,
    'graphql_single_name'=> 'caseStudy',
    'graphql_plural_name'=> 'caseStudies',
    'supports'           => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
    'menu_icon'          => 'dashicons-portfolio',
  ]);
});

/**
 * Register ACF field groups programmatically so the GraphQL schema has careerMeta + caseMeta.
 * Requires Advanced Custom Fields + WPGraphQL for ACF (if installed, fields become queryable).
 */
add_action('acf/init', function () {
  if (!function_exists('acf_add_local_field_group')) return;

  acf_add_local_field_group([
    'key'      => 'group_career_meta',
    'title'    => 'Career Meta',
    'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'career']]],
    'show_in_graphql' => 1,
    'graphql_field_name' => 'careerMeta',
    'fields'   => [
      ['key' => 'career_department', 'label' => 'Department', 'name' => 'department', 'type' => 'text'],
      ['key' => 'career_location',   'label' => 'Location',   'name' => 'location',   'type' => 'text'],
      ['key' => 'career_salary',     'label' => 'Salary',     'name' => 'salary',     'type' => 'text'],
      ['key' => 'career_job_type',   'label' => 'Job Type',   'name' => 'jobType',    'type' => 'select',
        'choices' => ['Full-time' => 'Full-time', 'Part-time' => 'Part-time', 'Contract' => 'Contract']],
      ['key' => 'career_level',      'label' => 'Level',      'name' => 'level',      'type' => 'select',
        'choices' => ['Junior' => 'Junior', 'Mid' => 'Mid', 'Senior' => 'Senior', 'Lead' => 'Lead']],
    ],
  ]);

  acf_add_local_field_group([
    'key'      => 'group_case_meta',
    'title'    => 'Case Study Meta',
    'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'case_study']]],
    'show_in_graphql' => 1,
    'graphql_field_name' => 'caseMeta',
    'fields'   => [
      ['key' => 'case_client',   'label' => 'Client',   'name' => 'client',   'type' => 'text'],
      ['key' => 'case_industry', 'label' => 'Industry', 'name' => 'industry', 'type' => 'text'],
      ['key' => 'case_year',     'label' => 'Year',     'name' => 'year',     'type' => 'text'],
      ['key' => 'case_duration', 'label' => 'Duration', 'name' => 'duration', 'type' => 'text'],
      ['key' => 'case_team',     'label' => 'Team',     'name' => 'team',     'type' => 'text'],
      ['key' => 'case_color',    'label' => 'Color',    'name' => 'color',    'type' => 'text'],
    ],
  ]);
});
