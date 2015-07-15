<?php

class ImportContentPiece {

    public function create_text_element($text){
        $data = array(
            'style'=>'',
            'draggable' => 'true',
            'element' => 'Text',
            'content' => $text,
            'bottom_margin' => '',
            'top_margin' => '',
            'left_margin' => '',
            'right_margin' => '',
           );

        $text_id = save_content_element($data);

        return $text_id;
    }

    public function save_content_piece($content_layout){

        $data = array(
            'post_status'      => 'pending',
            'content_type'     => 'student_question',
            'term_ids'         =>
                array(
                    'textbook'   => $this->textbook,
                    'chapter'    => $this->chapter,
                    'sections'   => $this->sections,
                    'subsections'=> $this->subsections,
                ),
            'post_tags'        => $this->tags,
            'duration'         => $this->duration,
            'difficulty_level' => $this->level,
            'instructions'     => '',
            'hint_enable'      => (!empty($this->hint))?'true':'false',
            'hint'             => $this->hint,
            'comment_enable'   => (!empty($this->comment))?'true':'false',
            'comment'          => $this->comment,
            );

        $data['json'] = $content_layout;
        _log($data);
        $id = save_content_piece($data);
        _log($id);

    }

    #get the attachment id of media file
    private function get_attachment_id_by_path($path){

        $attachment_id=0;
        $path = trim($path);

        if($path){

            $base_url = $this->get_media_base_url($path);

            global $wpdb;

            $query =$wpdb->prepare( "SELECT wposts.ID FROM $wpdb->posts wposts, $wpdb->postmeta wpostmeta
                            WHERE wposts.ID = wpostmeta.post_id AND wpostmeta.meta_key = '_wp_attached_file'
                            AND wpostmeta.meta_value LIKE '%s' AND wposts.post_type = 'attachment'",
                            $base_url.$path
                        );

            $attachment_id = $wpdb->get_var($query);

            _log($query);

        }

        return $attachment_id;
    }

    private function get_media_base_url($path){
        #get file type of attachment
        $type = get_media_file_type($path);
        $base_url = 'media-web/';
        switch ($type) {
            case 'video':
                $base_url .='videos-web/';
                break;

            case 'audio':
                $base_url .='audio-web/';
                break;

            default:
                $base_url .='images-web/';
                break;
        }

        return $base_url;

    }

    #path to the media file
    #creates an media element for the content piece and returns postmetaid
    public function create_media_element($media_path){

        $attachment_id = $this->get_attachment_id_by_path($media_path);
        if(!$attachment_id)
            return false;

        $type = get_media_file_type($media_path);
        $attachment_url =  wp_get_attachment_url( $attachment_id );

        $data= array(
            'style'         => '',
            'draggable'     => true,
            'element'       => ucfirst($type),
            $type.'_id'     => $attachment_id,
            $type.'_ids'    => array($attachment_id),
            $type.'Url'     => $attachment_url,
            $type.'Urls'    => array($attachment_url),
            'size'          => 'full',
            'align'         => 'left',
            'heightRatio'   => 0.23822714681440443,
            'topRatio'      => 0,
            'bottom_margin' => 0,
            'top_margin'    => 0,
            'left_margin'   => 0,
            'right_margin'  => 0,
            'height'        => 172,
            'top'           => 0
        );
        $media_element_id = save_content_element($data);
        _log($type);
        return array('id'=>$media_element_id,'type'=>ucfirst($type));
    }
}
